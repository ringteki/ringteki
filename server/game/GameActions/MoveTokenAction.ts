import { TokenAction, TokenActionProperties} from './TokenAction';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import StatusToken = require('../StatusTokens/StatusToken');
import { EventNames, Locations, CharacterStatus } from '../Constants';

export interface MoveTokenProperties extends TokenActionProperties {
    recipient: DrawCard;
}

export class MoveTokenAction extends TokenAction {
    name = 'moveStatusToken';
    eventName = EventNames.OnStatusTokenMoved;

    getEffectMessage(context: AbilityContext, additionalProperties = {}): [string, any[]] {
        const { target, recipient } = this.getProperties(context, additionalProperties) as MoveTokenProperties;
        return ['move {0}\'s status token to {1}', [(target as StatusToken).card, recipient]];
    }

    canAffect(token: StatusToken, context: AbilityContext, additionalProperties = {}): boolean {
        const { recipient } = this.getProperties(context) as MoveTokenProperties;
        if(!recipient || recipient.location !== Locations.PlayArea) {
            return false;
        } else if(token.grantedStatus === CharacterStatus.Honored && (recipient.isHonored || !recipient.checkRestrictions('receiveHonorToken', context))) {
            return false;
        } else if(token.grantedStatus === CharacterStatus.Dishonored && (recipient.isDishonored || !recipient.checkRestrictions('receiveDishonorToken', context))) {
            return false;
        } else if(token.grantedStatus === CharacterStatus.Tainted && (recipient.isTainted || !recipient.checkRestrictions('receiveTaintedToken', context))) {
            return false;
        }
        return super.canAffect(token, context, additionalProperties);
    }

    addPropertiesToEvent(event, token: StatusToken, context: AbilityContext, additionalProperties = {}): void {
        const { recipient } = this.getProperties(context) as MoveTokenProperties;
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.recipient = recipient;
    }

    eventHandler(event): void {
        event.token.card.removeStatusToken(event.token);
        event.recipient.addStatusToken(event.token);
        event.recipient.game.raiseEvent(EventNames.OnStatusTokenGained, { token: event.token, card: event.recipient });
    }
}
