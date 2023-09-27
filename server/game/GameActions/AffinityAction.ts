import type AbilityContext from '../AbilityContext';
import type { GameObject } from '../GameObject';
import { GameAction, type GameActionProperties } from './GameAction';

export interface AffinityActionProperties extends GameActionProperties {
    gameAction: GameAction;
    trait: string;
    noAffinityGameAction?: GameAction;
    promptTitleForConfirmingAffinity?: string;
}

export class AffinityAction extends GameAction {
    defaultProperties: AffinityActionProperties;

    getProperties(context: AbilityContext, additionalProperties = {}): AffinityActionProperties {
        let properties = super.getProperties(context, additionalProperties) as AffinityActionProperties;
        properties.gameAction.setDefaultTarget(() => properties.target);
        properties.noAffinityGameAction?.setDefaultTarget(() => properties.target);
        return properties;
    }

    getEffectMessage(context: AbilityContext, additionalProperties = {}): [string, any[]] {
        let properties = this.getProperties(context, additionalProperties);
        if (context.player.hasAffinity(properties.trait)) {
            return properties.gameAction.getEffectMessage(context);
        }

        return properties.noAffinityGameAction?.getEffectMessage(context) ?? ['', []];
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        if (context.player.hasAffinity(properties.trait)) {
            return properties.gameAction.hasLegalTarget(context, additionalProperties);
        }

        return properties.noAffinityGameAction?.hasLegalTarget(context, additionalProperties) ?? false;
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        if (context.player.hasAffinity(properties.trait)) {
            return properties.gameAction.canAffect(target, context, additionalProperties);
        }

        return properties.noAffinityGameAction?.canAffect(target, context, additionalProperties) ?? false;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if (!context.player.hasAffinity(properties.trait)) {
            return properties.noAffinityGameAction?.addEventsToArray(events, context, additionalProperties);
        }

        if (!properties.promptTitleForConfirmingAffinity) {
            return properties.gameAction.addEventsToArray(events, context, additionalProperties);
        }

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.promptTitleForConfirmingAffinity,
            source: context.source,
            choices: ['Yes', 'No'],
            handlers: [
                () => {
                    properties.gameAction.addEventsToArray(events, context, additionalProperties);
                },
                () => {}
            ]
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        if (context.player.hasAffinity(properties.trait)) {
            return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
        }
        return (
            properties.noAffinityGameAction?.hasTargetsChosenByInitiatingPlayer(context, additionalProperties) ?? false
        );
    }
}
