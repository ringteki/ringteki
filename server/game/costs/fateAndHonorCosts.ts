import { EventName, PlayType } from '../Constants.js';
import { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import * as GameActions from '../GameActions/GameActions.js';
import { HandlerAction } from '../GameActions/HandlerAction.js';
import { Derivable, derive } from '../utils/helpers.js';
import type { AbilityContext } from '../AbilityContext.js';
import { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import Ring from '../Ring.js';
import type { Cost } from './Cost.js';
import { GameActionCost } from './GameActionCost.js';
import { MetaActionCost } from './MetaActionCost.js';
import { ReduceableFateCost } from './ReduceableFateCost.js';
import { TargetDependentFateCost } from './TargetDependentFateCost.js';

/**
 * Cost that will pay the exact printed fate cost for the card.
 */
export function payPrintedFateCost(): Cost {
    return {
        canIgnoreForTargeting: true,
        canPay(context: TriggeredAbilityContext<DrawCard>) {
            const amount = context.source.getCost() ?? 0;
            return (
                context.player.fate >= amount &&
                (amount === 0 || context.player.checkRestrictions('spendFate', context))
            );
        },
        payEvent(context: TriggeredAbilityContext<DrawCard>) {
            const amount = context.source.getCost() ?? 0;
            return new Event(
                EventName.OnSpendFate,
                { amount, context },
                (event: Event) => ((event as GameEvent<EventName.OnSpendFate>).context.player.fate -= (event as GameEvent<EventName.OnSpendFate>).amount)
            );
        }
    };
}

/**
 * Cost that will pay the printed fate cost on the card minus any active
 * reducer effects the play has activated. Upon playing the card, all
 * matching reducer effects will expire, if applicable.
 */
export function payReduceableFateCost(ignoreType = false): Cost {
    return new ReduceableFateCost(ignoreType);
}

/**
 * Cost that is dependent on context.targets[targetName]
 */
export function payTargetDependentFateCost(targetName: string, ignoreType = false): Cost {
    return new TargetDependentFateCost(ignoreType, targetName);
}

/**
 * Cost in which the player must pay a fixed, non-reduceable amount of fate.
 */
export function payFate(amount: number | ((context: AbilityContext) => number) = 1): Cost {
    return new GameActionCost(
        typeof amount === 'function'
            ? GameActions.loseFate((context) => ({ target: context.player, amount: amount(context) }))
            : GameActions.loseFate((context) => ({ target: context.player, amount }))
    );
}

/**
 * Cost in which the player must pay a fixed, non-reduceable amount of honor.
 */
export function payHonor(amount = 1, dueToStatusToken = false): Cost {
    return new GameActionCost(GameActions.loseHonor((context) => ({ target: context.player, amount, dueToStatusToken })));
}

export function giveHonorToOpponent(amount = 1): Cost {
    return new GameActionCost(GameActions.takeHonor((context) => ({ target: context.player, amount })));
}

/**
 * Cost where a character must spend fate to an unclaimed ring
 */
export function payFateToRing(amount = 1, ringCondition = (ring: Ring) => ring.isUnclaimed()): Cost {
    return new MetaActionCost(
        GameActions.selectRing({
            ringCondition,
            gameAction: GameActions.placeFateOnRing((context) => ({ amount, origin: context.player }))
        }),
        'Select a ring to place fate on'
    );
}

export function giveFateToOpponent(amount = 1): Cost {
    return new GameActionCost(GameActions.takeFate((context) => ({ target: context.player, amount })));
}

export function variableHonorCost(amountFunc: (context: TriggeredAbilityContext) => number): Cost {
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext) {
            return amountFunc(context) > 0 && context.game.actions.loseHonor().canAffect(context.player, context);
        },
        resolve(context: TriggeredAbilityContext, result) {
            const amount = amountFunc(context);
            const max = Math.min(amount, context.player.honor);
            const choices = Array.from(Array(max), (x, i) => String(i + 1));
            if(result.canCancel) {
                choices.push('Cancel');
            }
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose how much honor to pay',
                context: context,
                choices: choices,
                choiceHandler: (choice: string) => {
                    if(choice === 'Cancel') {
                        context.costs.variableHonorCost = 0;
                        result.cancelled = true;
                    } else {
                        context.costs.variableHonorCost = parseInt(choice);
                    }
                }
            });
        },
        payEvent(context: TriggeredAbilityContext) {
            const action = context.game.actions.loseHonor({ amount: context.costs.variableHonorCost as number });
            return action.getEvent(context.player, context);
        }
    };
}

export function variableFateCost(properties: {
    activePromptTitle: string;
    minAmount?: Derivable<number, TriggeredAbilityContext>;
    maxAmount: Derivable<number, TriggeredAbilityContext>;
}): Cost {
    function deriveMinAmount(context: TriggeredAbilityContext) {
        return properties.minAmount === undefined ? 1 : derive(properties.minAmount, context);
    }
    function deriveMaxAmount(context: TriggeredAbilityContext) {
        return properties.maxAmount === undefined ? -1 : derive(properties.maxAmount, context);
    }
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext<DrawCard>) {
            if(context.ignoreFateCost) {
                return true;
            }
            const costModifiers = context.player.getTotalCostModifiers(PlayType.PlayFromHand, context.source);
            return (
                costModifiers < 0 ||
                (context.player.fate >= deriveMinAmount(context) + costModifiers &&
                    context.game.actions.loseFate().canAffect(context.player, context))
            );
        },
        resolve(context: TriggeredAbilityContext<DrawCard>, result) {
            const costModifiers = context.ignoreFateCost
                ? -1000
                : context.player.getTotalCostModifiers(PlayType.PlayFromHand, context.source);

            const maxAmount = deriveMaxAmount(context);
            const min = deriveMinAmount(context);
            let max = context.player.fate - costModifiers;
            if(maxAmount >= 0) {
                max = Math.min(maxAmount, context.player.fate - costModifiers);
            }
            if(!context.game.actions.loseFate().canAffect(context.player, context)) {
                max = Math.min(max, -costModifiers);
            }
            const choices = Array.from({ length: max + 1 - min }, (_, idx) => String(idx + min));
            if(result.canCancel) {
                choices.push('Cancel');
            }
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: properties.activePromptTitle
                    ? properties.activePromptTitle
                    : 'Choose how much fate to pay',
                context: context,
                choices: choices,
                choiceHandler: (choice: string) => {
                    if(choice === 'Cancel') {
                        context.costs.variableFateCost = 0;
                        result.cancelled = true;
                    } else {
                        context.costs.variableFateCost = Math.max(0, parseInt(choice));
                    }
                }
            });
        },
        payEvent(context: TriggeredAbilityContext<DrawCard>) {
            const payZeroFate = new HandlerAction({});
            if(context.ignoreFateCost) {
                return payZeroFate.getEvent(context.player, context);
            }

            const costModifiers = context.player.getTotalCostModifiers(PlayType.PlayFromHand, context.source);
            const cost = (context.costs.variableFateCost as number) + Math.min(0, costModifiers); //+ve cost modifiers are applied by the engine
            if(cost > 0) {
                const action = context.game.actions.loseFate({ amount: cost });
                return action.getEvent(context.player, context);
            }

            return payZeroFate.getEvent(context.player, context);
        }
    };
}
