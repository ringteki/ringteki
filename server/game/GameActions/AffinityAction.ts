import type AbilityContext from '../AbilityContext';
import type { GameObject } from '../GameObject';
import { GameAction, type GameActionProperties } from './GameAction';

export interface AffinityActionProperties extends GameActionProperties {
    trait: string;
    gameAction: GameAction;
    promptTitleForConfirmingAffinity?: string;
}

export class AffinityAction extends GameAction {
    defaultProperties: AffinityActionProperties;

    getProperties(context: AbilityContext, additionalProperties = {}): AffinityActionProperties {
        let properties = super.getProperties(context, additionalProperties) as AffinityActionProperties;
        properties.gameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        return this.getProperties(context).gameAction.getEffectMessage(context);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}) {
        return this.getProperties(context, additionalProperties).gameAction.hasLegalTarget(
            context,
            additionalProperties
        );
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}) {
        return this.getProperties(context, additionalProperties).gameAction.canAffect(
            target,
            context,
            additionalProperties
        );
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        if (!context.player.hasAffinity(properties.trait)) {
            return;
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
        return this.getProperties(context, additionalProperties).gameAction.hasTargetsChosenByInitiatingPlayer(
            context,
            additionalProperties
        );
    }
}
