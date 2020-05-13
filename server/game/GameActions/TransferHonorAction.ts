import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames, EffectNames } from '../Constants';
import HonorLogic from './Shared/HonorLogic';

export interface TransferHonorProperties extends PlayerActionProperties {
    amount?: number;
    afterBid?: boolean
}

export class TransferHonorAction extends PlayerAction {
    name = 'takeHonor';
    eventName = EventNames.OnTransferHonor;
    defaultProperties: TransferHonorProperties = { amount: 1, afterBid: false };

    constructor(propertyFactory: TransferHonorProperties | ((context: AbilityContext) => TransferHonorProperties)) {
        super(propertyFactory);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferHonorProperties;
        return ['giving {1} honor to {2}', [properties.amount, context.player.opponent]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferHonorProperties;
        return ['take {1} honor from {0}', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TransferHonorProperties;

        const gainsHonor = properties.amount > 0;
        if(!gainsHonor)
            return false;

        var [hasLimit, amountToTransfer] = HonorLogic.CalculateHonorLimit(player.opponent, context.game.roundNumber, context.game.currentPhase, properties.amount);
        if(hasLimit && !amountToTransfer)
            return false;

        return player.opponent && super.canAffect(player, context);
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { afterBid, amount } = this.getProperties(context, additionalProperties) as TransferHonorProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.afterBid = afterBid;
    }

    eventHandler(event): void {
        var [_, amountToTransfer] = HonorLogic.CalculateHonorLimit(event.player.opponent, event.context.game.roundNumber, event.context.game.currentPhase, event.amount);

        if(event.player && event.player.opponent) {
            event.player.modifyHonor(-amountToTransfer);
            event.player.opponent.modifyHonor(amountToTransfer);
        }
    }
}
