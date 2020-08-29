import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';
import { CalculateHonorLimit } from './Shared/HonorLogic';

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
        var [_, amountToTransfer] = CalculateHonorLimit(context.player, context.game.roundNumber, context.game.currentPhase, properties.amount);
        return ['gain ' + amountToTransfer + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: GainHonorProperties = this.getProperties(context, additionalProperties);
        var wouldGainAnyHonor = properties.amount !== 0;

        if (!wouldGainAnyHonor)
            return false;

        var [hasHonorLimit, amountToTransfer] = CalculateHonorLimit(player, context.game.roundNumber, context.game.currentPhase, properties.amount);

        if(hasHonorLimit && !amountToTransfer)
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
        var [_, amountToTransfer] = CalculateHonorLimit(event.player, event.context.game.roundNumber, event.context.game.currentPhase, event.amount);
        event.player.modifyHonor(amountToTransfer);
    }
}
