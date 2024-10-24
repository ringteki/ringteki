import type { AbilityContext } from '../AbilityContext';
import { EventNames } from '../Constants';
import type { StatusToken } from '../StatusToken';
import { TokenAction, TokenActionProperties } from './TokenAction';

export interface DiscardStatusProperties extends TokenActionProperties {}

export class DiscardStatusAction extends TokenAction<DiscardStatusProperties> {
    name = 'discardStatus';
    eventName = EventNames.OnStatusTokenDiscarded;
    cost = 'discarding a status token';

    getEffectMessage(context: AbilityContext): [string, any[]] {
        const cardsLosingStatus = this.#cardsLosingStatus(context);
        return cardsLosingStatus.length === 0
            ? ['discard a status token', []]
            : ["discard {0}'s status token", cardsLosingStatus];
    }

    addPropertiesToEvent(
        event: any,
        token: StatusToken,
        context: AbilityContext<any>,
        additionalProperties: any
    ): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.cards = this.#cardsLosingStatus(context);
    }

    eventHandler(event): void {
        const tokens = Array.isArray(event.token) ? event.token : [event.token];
        for (const token of tokens) {
            token.card.removeStatusToken(token);
        }
    }

    #cardsLosingStatus(context: AbilityContext) {
        let properties = this.getProperties(context);
        if (!properties.target) {
            return [];
        }

        const targets = Array.isArray(properties.target) ? properties.target : [properties.target];
        return targets.map((a) => {
            let token = a as StatusToken;
            if (token) return token.card;
            return a;
        });
    }
}