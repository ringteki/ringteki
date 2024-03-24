import { AbilityContext } from '../AbilityContext';
import type BaseAbility from '../baseability';
import type CardAbility from '../CardAbility';
import CardSelector from '../CardSelector';
import { Locations, Players, Stages, TargetModes } from '../Constants';
import type { GameAction } from '../GameActions/GameAction';
import { AbilityTargetBase } from './AbilityTargetBase';
import type { CardCondition, GameActionEnforced, GameActionUnenforce } from './types';

type AbilityTargetAbilityPropsBase = {
    mode: TargetModes.Ability;
    dependsOn?: string;
    abilityCondition?: (ability: CardAbility) => boolean;
    activePromptTitle?: string;
    controller?: Players;
    location?: Locations | Locations[];
    player?: Players | ((context: AbilityContext) => Players);
} & CardCondition;

export type AbilityTargetAbilityProps = AbilityTargetAbilityPropsBase & GameActionUnenforce;

export type AbilityTargetAbilityPropsEnf = AbilityTargetAbilityPropsBase & GameActionEnforced;

export class AbilityTargetAbility extends AbilityTargetBase {
    abilityCondition: (ability: CardAbility) => boolean;
    selector: any;

    constructor(
        public name: string,
        protected properties: AbilityTargetAbilityPropsEnf,
        ability: BaseAbility
    ) {
        super();
        this.abilityCondition = properties.abilityCondition ?? (() => true);
        this.selector = this.getSelector(properties);

        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties: AbilityTargetAbilityProps): any {
        let cardCondition = (card, context) => {
            let abilities = card.actions
                .concat(card.reactions)
                .filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
            return abilities.some((ability) => {
                let contextCopy = context.copy();
                contextCopy.targetAbility = ability;
                if (
                    context.stage === Stages.PreTarget &&
                    this.dependentCost &&
                    !this.dependentCost.canPay(contextCopy)
                ) {
                    return false;
                }
                return (
                    (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                    (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                    (properties.gameAction as any).some((gameAction) => gameAction.hasLegalTarget(contextCopy))
                );
            });
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: false }));
    }

    canResolve(context): boolean {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context): boolean {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context): GameAction[] {
        return this.properties.gameAction.filter((gameAction) => gameAction.hasLegalTarget(context));
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
        let buttons = [];
        let waitingPromptTitle = '';
        if (context.stage === Stages.PreTarget) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if (context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            context: context,
            selector: this.selector,
            onSelect: (player, card) => {
                let abilities = card.actions
                    .concat(card.reactions)
                    .filter((ability) => ability.isTriggeredAbility() && this.abilityCondition(ability));
                if (abilities.length === 1) {
                    context.targetAbility = abilities[0];
                } else if (abilities.length > 1) {
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Choose an ability',
                        context: context,
                        choices: abilities.map((ability) => ability.title).concat('Back'),
                        choiceHandler: (choice) => {
                            if (choice === 'Back') {
                                context.game.queueSimpleStep(() => this.resolve(context, targetResults));
                            } else {
                                context.targetAbility = abilities.find((ability) => ability.title === choice);
                            }
                        }
                    });
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if (arg === 'costsFirst') {
                    targetResults.costsFirst = true;
                    return true;
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context) {
        if (
            !context.targetAbility ||
            (context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player)
        ) {
            return false;
        }
        return (
            this.properties.cardType === context.targetAbility.card.type &&
            (!this.properties.cardCondition || this.properties.cardCondition(context.targetAbility.card, context)) &&
            this.abilityCondition(context.targetAbility)
        );
    }

    getChoosingPlayer(context) {
        let playerProp = this.properties.player;
        if (typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        if (this.properties.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}