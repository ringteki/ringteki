import { AbilityContext } from '../AbilityContext.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { EventName, Location, Players } from '../Constants.js';
import type { Cost, Result } from './Cost.js';
import { Event } from '../Events/Event.js';
import { removeFate } from '../GameActions/GameActions.js';
import BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import Ring from '../Ring.js';

const CANCELLED = 'CANCELLED';
const STOP = 'STOP';

type PoolOption = BaseCard | Ring | typeof CANCELLED | typeof STOP;
type Props = {
    reducedCost: number;
    remainingPoolTotal: number;
    minFate?: number;
    maxFate?: number;
    pool?: PoolOption;
    numberOfChoices?: number;
};

export class ReduceableFateCost implements Cost {
    public isPlayCost = true;
    public isPrintedFateCost = true;
    public payFateCostToOpponent = false;
    constructor(public ignoreType: boolean) { }

    public canPay(context: AbilityContext<DrawCard>): boolean {
        if(context.source.printedCost === null) {
            return false;
        }

        const minCost = context.player.getMinimumCost(context.playType, context, undefined, this.ignoreType);
        if(minCost === 0) {
            return true;
        }

        if(context.source.isTemptationsMaho()) {
            return false;
        }

        return context.player.fate >= minCost && context.player.checkRestrictions('spendFate', context);
    }

    protected getAlternateFatePools(context: AbilityContext<DrawCard>): Set<BaseCard | Ring> {
        return new Set(context.player.getAlternateFatePools(context.playType, context.source, context));
    }

    public resolve(context: AbilityContext<DrawCard>, result: Result): void {
        const alternatePools = this.getAlternateFatePools(context);

        const ringPool = new Set<Ring>();
        const cardPool = new Set<BaseCard>();
        let alternatePoolTotal = 0;
        for(const pool of alternatePools) {
            if(pool instanceof Ring) {
                ringPool.add(pool);
            } else {
                cardPool.add(pool);
            }
            alternatePoolTotal += pool.getFate();
        }

        const maxPlayerFate = this.#getMaxPlayerFate(context);
        const reducedCost = this.getReducedCost(context);
        if(reducedCost > maxPlayerFate + alternatePoolTotal) {
            result.cancelled = true;
            return;
        }

        if(result.cancelled || alternatePools.size === 0) {
            return;
        }

        const properties: Props = {
            reducedCost: reducedCost,
            remainingPoolTotal: alternatePoolTotal
        };
        context.costs.alternateFate = new Map();
        if(properties.reducedCost === 0) {
            return;
        }

        const handler = (alternatePool: PoolOption) => {
            if(alternatePool === CANCELLED) {
                result.cancelled = true;
                return;
            }
            if(alternatePool === STOP) {
                return;
            }
            context.game.queueSimpleStep(() => {
                const altFate = alternatePool.getFate();
                properties.remainingPoolTotal -= altFate;
                properties.minFate = Math.max(
                    properties.reducedCost - maxPlayerFate - properties.remainingPoolTotal,
                    0
                );
                properties.maxFate = Math.min(altFate, properties.reducedCost);
                properties.pool = alternatePool;
                properties.numberOfChoices = properties.maxFate - properties.minFate + 1;
                if(result.cancelled || properties.numberOfChoices === 0) {
                    return;
                }
                const choiceHandler = () => {
                    alternatePools.delete(alternatePool);
                    if(alternatePools.size > 0 && properties.reducedCost > 0) {
                        this.promptForAlternateFateCardSelect(
                            context,
                            properties.reducedCost - maxPlayerFate,
                            alternatePools,
                            handler
                        );
                    }
                };
                this.promptForAlternateFate(context, result, properties, choiceHandler);
            });
        };

        for(const alternatePool of ringPool) {
            context.game.queueSimpleStep(() => {
                properties.remainingPoolTotal -= alternatePool.getFate();
                properties.minFate = Math.max(
                    properties.reducedCost - maxPlayerFate - properties.remainingPoolTotal,
                    0
                );
                properties.maxFate = Math.min(alternatePool.getFate(), properties.reducedCost);
                properties.pool = alternatePool;
                properties.numberOfChoices = properties.maxFate - properties.minFate + 1;
                if(result.cancelled || properties.numberOfChoices === 0) {
                    return;
                }
                this.promptForAlternateFate(context, result, properties);
            });
        }

        if(cardPool.size > 0) {
            this.promptForAlternateFateCardSelect(context, properties.reducedCost - maxPlayerFate, cardPool, handler);
        }
    }

    protected getReducedCost(context: AbilityContext<DrawCard>): number {
        return context.player.getReducedCost(context.playType, context.source, undefined, this.ignoreType);
    }

    protected getFinalFatecost(context: AbilityContext<DrawCard>, reducedCost: number) {
        if(!context.costs.alternateFate) {
            return reducedCost;
        }
        let totalAlternateFate = 0;
        for(const alternatePool of this.getAlternateFatePools(context)) {
            const amount = (context.costs.alternateFate as Map<unknown, number>).get(alternatePool);
            if(amount) {
                context.game.addMessage(
                    '{0} takes {1} fate from {2} to pay the cost of {3}',
                    context.player,
                    amount,
                    alternatePool,
                    context.source
                );
                removeFate({ amount }).resolve(alternatePool, context);
                totalAlternateFate += amount;
            }
        }
        return Math.max(reducedCost - totalAlternateFate, 0);
    }

    private promptForAlternateFateCardSelect(
        context: AbilityContext<DrawCard>,
        minFate: number,
        cards: Set<BaseCard | Ring>,
        handler: (alternatePool: PoolOption) => void
    ) {
        const currentCard = context.source;
        const buttons = [{ text: 'Cancel', arg: CANCELLED }];
        if(minFate <= 0) {
            buttons.push({ text: 'Done', arg: STOP });
        }
        const waitingPromptTitle =
            context.ability.abilityType === 'action'
                ? 'Waiting for opponent to take an action or pass'
                : 'Waiting for opponent';

        context.game.promptForSelect(context.player, {
            activePromptTitle: `Choose a card to help pay the fate cost of ${currentCard.name}`,
            waitingPromptTitle,
            context,
            location: Location.PlayArea,
            controller: Players.Self,
            buttons,
            cardCondition: (card: BaseCard) => cards.has(card),
            onSelect: (_player: unknown, card: BaseCard) => {
                handler(card);
                return true;
            },
            onCancel: () => {
                handler(CANCELLED);
                return true;
            },
            onMenuCommand: (_player: unknown, arg: string) => {
                handler(arg as PoolOption);
                return true;
            }
        });
    }

    private promptForAlternateFate(
        context: AbilityContext<DrawCard>,
        result: Result,
        properties: Props,
        handler?: (choice: string) => void
    ) {
        const choices: Array<number | string> = Array.from(
            { length: properties.numberOfChoices ?? 0 },
            (_, idx) => idx + (properties.minFate ?? 0)
        );
        if(result.canCancel) {
            choices.push('Cancel');
        }
        if(properties.maxFate === 0) {
            (context.costs.alternateFate as Map<unknown, number>).set(properties.pool, 0);
            return;
        }

        if(!properties.pool || typeof properties.pool === 'string') {
            return;
        }

        const pool = properties.pool;
        context.player.setSelectableCards([pool as BaseCard]);
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: `Choose amount of fate to spend from ${pool.name}`,
            choices: choices,
            choiceHandler: (choice: string) => {
                context.player.clearSelectableCards();

                if(choice === 'Cancel') {
                    result.cancelled = true;
                    return;
                }

                (context.costs.alternateFate as Map<unknown, number>).set(properties.pool, parseInt(choice, 10));
                properties.reducedCost -= parseInt(choice, 10);

                if(handler) {
                    handler(choice);
                }
            }
        });
    }

    /**
     * USED FOR EXTENDING THIS CLASS
     */
    protected afterPayHook(_event: Event): void { }

    public payEvent(context: TriggeredAbilityContext<DrawCard>): Event {
        const amount = this.getReducedCost(context);
        context.costs.fate = amount;
        return new Event(EventName.OnSpendFate, { amount, context }, (event) => {
            context.player.markUsedReducers(context.playType, context.source);
            context.player.fate -= this.getFinalFatecost(context, amount);
            this.afterPayHook(event);
        });
    }

    #getMaxPlayerFate(context: AbilityContext<DrawCard>): number {
        if(context.source.isTemptationsMaho()) {
            return 0;
        }
        if(context.player.checkRestrictions('spendFate', context)) {
            return context.player.fate;
        }
        return 0;
    }
}
