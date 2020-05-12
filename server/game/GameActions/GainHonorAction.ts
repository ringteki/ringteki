import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames, EffectNames } from '../Constants';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainHonorAction extends PlayerAction {
    defaultProperties: GainHonorProperties = { amount: 1 };

    name: string = 'gainHonor';
    eventName = EventNames.OnModifyHonor;
    constructor(propertyFactory: GainHonorProperties | ((context: AbilityContext) => GainHonorProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: GainHonorProperties = this.getProperties(context);
        return ['gain ' + properties.amount + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: GainHonorProperties = this.getProperties(context, additionalProperties);
        var wouldGainAnyHonor = properties.amount !== 0;

        if (!wouldGainAnyHonor)
            return false;

        const honorGainLimitPerPhase = player.getEffects(EffectNames.LimitHonorGainPerPhase).reduce((total, value) => total + value, 0);
        const honorGainedThisPhase = player.honorGained(context.game.roundNumber, context.game.currentPhase, true);

        if(honorGainLimitPerPhase && honorGainedThisPhase >= honorGainLimitPerPhase)
            return false;

        return super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as GainHonorProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event): void {
        const honorGainLimitPerPhase = event.player.getEffects(EffectNames.LimitHonorGainPerPhase).reduce((total, value) => total + value, 0);
        const honorGainedThisPhase = event.player.honorGained(event.context.game.roundNumber, event.context.game.currentPhase, true);

        if(!honorGainLimitPerPhase) {
            event.player.modifyHonor(event.amount);
        } else {
            const maxAmountToTransfer = honorGainLimitPerPhase - honorGainedThisPhase;
            const amountToTransfer = Math.min(event.amount, maxAmountToTransfer);

            event.player.modifyHonor(amountToTransfer);
        }
    }
}
