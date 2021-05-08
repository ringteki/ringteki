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
        }
        return super.canAffect(token, context, additionalProperties);
    }

    addPropertiesToEvent(event, token: StatusToken, context: AbilityContext, additionalProperties = {}): void {
        const { recipient } = this.getProperties(context) as MoveTokenProperties;
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.recipient = recipient;
    }

    eventHandler(event): void {
        if(event.token.card.personalHonor === event.token) {
            event.token.card.makeOrdinary();
            if((event.recipient.isHonored && event.token.grantedStatus === CharacterStatus.Dishonored) || (event.recipient.isDishonored && event.token.grantedStatus === CharacterStatus.Honored)) {
                event.recipient.makeOrdinary();
            } else if(!event.recipient.personalHonor) {
                event.recipient.setPersonalHonor(event.token);
            }
            event.recipient.game.raiseEvent(EventNames.OnStatusTokenGained, { token: event.token, card: event.recipient });
        }
    }
}
