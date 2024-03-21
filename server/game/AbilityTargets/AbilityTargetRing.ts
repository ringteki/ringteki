import type { AbilityContext } from '../AbilityContext';
import BaseAbility from '../baseability';
import { Players, Stages, TargetModes } from '../Constants';
import type { GameAction } from '../GameActions/GameAction';
import type Ring from '../ring';
import { AbilityTargetBase } from './AbilityTargetBase';

export type AbilityTargetRingProps = {
    mode: TargetModes.Ring;
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    activePromptTitle?: string;
    optional?: boolean;
    dependsOn?: string;
    gameAction?: GameAction[];
    player?: Players | ((context: AbilityContext) => Players);
};

export class AbilityTargetRing extends AbilityTargetBase {
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;

    constructor(
        public name: string,
        private properties: AbilityTargetRingProps,
        ability: BaseAbility
    ) {
        super();
        this.ringCondition = (ring, context) => {
            let contextCopy = (context as any).copy();
            contextCopy.rings[this.name] = ring;
            if (this.name === 'target') {
                contextCopy.ring = ring;
            }
            if (context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (
                (properties.gameAction.length === 0 ||
                    properties.gameAction.some((gameAction) => gameAction.hasLegalTarget(contextCopy))) &&
                properties.ringCondition(ring, contextCopy) &&
                (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy))
            );
        };
        for (let gameAction of this.properties.gameAction) {
            gameAction.getDefaultTargets = (context) => context.rings[name];
        }
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find((target) => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    canResolve(context: AbilityContext): boolean {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context: AbilityContext) {
        return (
            this.properties.optional ||
            Object.values(context.game.rings).some((ring) => this.ringCondition(ring, context))
        );
    }

    getGameAction(context) {
        return this.properties.gameAction.filter((gameAction) => gameAction.hasLegalTarget(context));
    }

    getAllLegalTargets(context: AbilityContext) {
        return Object.values(context.game.rings).filter((ring) => this.ringCondition(ring, context));
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
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            buttons: buttons,
            onSelect: (player, ring) => {
                context.rings[this.name] = ring;
                if (this.name === 'target') {
                    context.ring = ring;
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
        context.game.promptForRingSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context) {
        if (
            !context.rings[this.name] ||
            (context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player)
        ) {
            return false;
        }
        return (
            (this.properties.optional && context.rings[this.name].length === 0) ||
            this.properties.ringCondition(context.rings[this.name], context)
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
