import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Derivable, derive } from '../utils/helpers.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface OptionalActionProperties extends GameActionProperties {
    gameAction: GameAction;
    effect?: string;
    effectArgs?: Derivable<Array<unknown>, AbilityContext>;
    promptTitleForConfirming: string;
    showMessageOnNo?: boolean;
}

export class OptionalAction extends GameAction<OptionalActionProperties> {
    getProperties(context: AbilityContext, additionalProperties = {}): OptionalActionProperties {
        let properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getEffectMessage(context: AbilityContext, additionalProperties = {}): MessageArgs {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.getEffectMessage(context);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.hasLegalTarget(context, additionalProperties);
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.promptTitleForConfirming,
            source: context.source,
            choices: ['Yes', 'No'],
            handlers: [
                () => this.resolveAction(properties, events, context, additionalProperties),
                () => this.skipAction(properties, context)]
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }

    resolveAction(
        properties: OptionalActionProperties,
        events: Event[],
        context: AbilityContext,
        additionalProperties = {}
    ) {
        properties.gameAction.addEventsToArray(events, context, additionalProperties);
        const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
        const nextArg = args.length;
        const msg = `{${nextArg}} chooses to ${properties.effect ?? ''}`;
        context.game.addMessage(msg, ...(args as MsgArg[]), context.player);
    }

    skipAction(
        properties: OptionalActionProperties,
        context: AbilityContext
    ) {
        if(properties.showMessageOnNo) {
            const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
            const nextArg = args.length;
            const msg = `{${nextArg}} chooses not to ${properties.effect ?? ''}`;
            context.game.addMessage(msg, ...(args as MsgArg[]), context.player);
        }
    }
}
