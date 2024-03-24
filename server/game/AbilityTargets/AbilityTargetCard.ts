import type { AbilityContext } from '../AbilityContext';
import type BaseAbility from '../baseability';
import CardSelector from '../CardSelector';
import { EffectNames, Locations, Players, Stages, TargetModes } from '../Constants';
import type DrawCard from '../drawcard';
import { AbilityTargetBase } from './AbilityTargetBase';
import type { CardCondition, GameActionEnforced, GameActionUnenforce } from './types';

type AbilityTargetCardPropsBase = {
    activePromptTitle?: string;
    controller?: Players | ((context: AbilityContext) => Players);
    dependsOn?: string;
    hideIfNoLegalTargets?: boolean;
    location?: Locations | Array<Locations>;
    optional?: boolean;
    player?: Players | ((context: AbilityContext) => Players);
    targets?: boolean;
} & CardCondition &
    (
        | {
              mode: TargetModes.MaxStat;
              numCards: number;
              cardStat: (card: DrawCard) => number;
              maxStat: () => number;
          }
        | {
              mode: TargetModes.UpToVariable | TargetModes.ExactlyVariable;
              numCardsFunc: (context: AbilityContext) => number;
          }
        | { mode: TargetModes.UpTo | TargetModes.Exactly; numCards: number }
        | { mode: TargetModes.Single | TargetModes.Unlimited }
        | {}
    );

export type AbilityTargetCardProps = AbilityTargetCardPropsBase & GameActionUnenforce;

export type AbilityTargetCardPropsEnf = AbilityTargetCardPropsBase & GameActionEnforced;

export class AbilityTargetCard extends AbilityTargetBase {
    selector: any;

    constructor(
        public name: string,
        protected properties: AbilityTargetCardPropsEnf,
        ability: BaseAbility
    ) {
        super();
        for (let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context) => context.targets[name]);
        }
        this.selector = this.getSelector(properties);
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let contextCopy = this.getContextCopy(card, context);
            if (context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (
                (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                (properties.gameAction.length === 0 ||
                    properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy)))
            );
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: true }));
    }

    getContextCopy(card, context) {
        let contextCopy = context.copy();
        contextCopy.targets[this.name] = card;
        if (this.name === 'target') {
            contextCopy.target = card;
        }
        return contextCopy;
    }

    canResolve(context) {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context) {
        return this.properties.gameAction.filter((gameAction) => gameAction.hasLegalTarget(context));
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    resolve(context, targetResults) {
        if (targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if (player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        const { cardCondition, player: _, ...otherProperties } = this.properties;

        let buttons = [];
        let waitingPromptTitle = '';
        if (context.stage === Stages.PreTarget) {
            if (!targetResults.noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if (context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let mustSelect = this.selector
            .getAllLegalTargets(context, player)
            .filter((card) =>
                card.getEffects(EffectNames.MustBeChosen).some((restriction) => restriction.isMatch('target', context))
            );
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            mustSelect: mustSelect,
            onSelect: (player, card) => {
                context.targets[this.name] = card;
                if (this.name === 'target') {
                    context.target = card;
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if (arg === 'costsFirst') {
                    targetResults.payCostsFirst = true;
                    return true;
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
    }

    checkTarget(context) {
        if (!context.targets[this.name]) {
            return false;
        } else if (context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        let cards = context.targets[this.name];
        if (!Array.isArray(cards)) {
            cards = [cards];
        }
        return (
            cards.every((card) =>
                this.selector.canTarget(
                    card,
                    context,
                    context.choosingPlayerOverride || this.getChoosingPlayer(context)
                )
            ) &&
            this.selector.hasEnoughSelected(cards, context) &&
            !this.selector.hasExceededLimit(cards, context)
        );
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        if (
            this.getChoosingPlayer(context) === context.player &&
            (this.selector.optional || this.selector.hasEnoughTargets(context, context.player.opponent))
        ) {
            return true;
        }
        return !this.properties.dependsOn && this.checkGameActionsForTargetsChosenByInitiatingPlayer(context);
    }

    checkGameActionsForTargetsChosenByInitiatingPlayer(context) {
        return this.getAllLegalTargets(context).some((card) => {
            let contextCopy = this.getContextCopy(card, context);
            if (this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(contextCopy))) {
                return true;
            } else if (this.dependentTarget) {
                return this.dependentTarget.checkGameActionsForTargetsChosenByInitiatingPlayer(contextCopy);
            }
            return false;
        });
    }
}
