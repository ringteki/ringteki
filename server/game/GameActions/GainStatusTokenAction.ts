import { CardGameAction, CardActionProperties } from './CardGameAction';
import { EventNames, CharacterStatus } from '../Constants';
import AbilityContext = require("../AbilityContext");
import BaseCard = require('../basecard');

export interface GainStatusTokenProperties extends CardActionProperties {
    token?: CharacterStatus
}

export class GainStatusTokenAction extends CardGameAction {
    name = 'gainStatus';
    eventName = EventNames.OnStatusTokenGained;
    defaultProperties: GainStatusTokenProperties = {
        token: CharacterStatus.Honored
    };

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let { token } = this.getProperties(context) as GainStatusTokenProperties;
        if(token === CharacterStatus.Honored && card.isHonored || token === CharacterStatus.Dishonored && card.isDishonored) {
            return false;
        }
        if(token === CharacterStatus.Dishonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        if(token === CharacterStatus.Honored && !card.checkRestrictions('receiveHonorToken', context)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as GainStatusTokenProperties;
        return['give {0} a {1} status token', [properties.target, properties.token]];
    }

    addPropertiesToEvent(event, card: BaseCard, context: AbilityContext, additionalProperties = {}): void {
        const { token } = this.getProperties(context, additionalProperties) as GainStatusTokenProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.token = token;
    }

    eventHandler(event): void {
        event.card.addStatusToken(event.token);
    }
}
