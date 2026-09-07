import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToStatusToken?: boolean;
}

export class GainHonorAction extends PlayerAction<GainHonorProperties> {
    defaultProperties: GainHonorProperties = { amount: 1, dueToStatusToken: false };

    name: string = 'gainHonor';
    eventName = EventName.OnModifyHonor;

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context);
        var [_, amountToTransfer] = CalculateHonorLimit(
            context.player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount ?? 0
        );
        return ['gain ' + amountToTransfer + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        var wouldGainAnyHonor = properties.amount !== 0;

        if(!wouldGainAnyHonor) {
            return false;
        }

        var [hasHonorLimit, amountToTransfer] = CalculateHonorLimit(
            player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount ?? 0
        );

        if(hasHonorLimit && !amountToTransfer) {
            return false;
        }

        return super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnModifyHonor>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.dueToStatusToken = dueToStatusToken;
    }

    eventHandler(event: GameEvent<EventName.OnModifyHonor>): void {
        const context = event.context as AbilityContext;
        const player = event.player as Player;
        var [_, amountToTransfer] = CalculateHonorLimit(
            player,
            context.game.roundNumber,
            context.game.currentPhase,
            event.amount as number
        );
        player.modifyHonor(amountToTransfer);
        if(amountToTransfer && context?.game) {
            context.game.addAnimation({ type: 'honor', playerName: player.name, amount: amountToTransfer });
        }
    }
}
