import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction extends PlayerAction {
    name = 'draw';
    eventName = EventNames.OnCardsDrawn;

    defaultProperties: DrawProperties = {
        amount: 1
    };
    constructor(properties: DrawProperties | ((context: AbilityContext) => DrawProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DrawProperties;
        return ['draw ' + properties.amount + (properties.amount > 1 ? ' cards' : ' card'), []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DrawProperties;
        return properties.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as DrawProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event): void {
        event.player.drawCardsToHand(event.amount);
    }
}
