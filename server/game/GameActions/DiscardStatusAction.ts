import { TokenAction, TokenActionProperties} from './TokenAction';
import { EventNames } from '../Constants';
import AbilityContext = require("../AbilityContext");
import StatusToken = require('../StatusTokens/StatusToken');

export interface DiscardStatusProperties extends TokenActionProperties {
}

export class DiscardStatusAction extends TokenAction {
    name = 'discardStatus';
    eventName = EventNames.OnStatusTokenDiscarded;
    cost = 'discarding a status token';

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DiscardStatusProperties;
        if (properties.target) {
            let targets = properties.target;
            if (!Array.isArray(targets)) {
                targets = [targets];
            }
            let cards = targets.map(a => {
                let token = a as StatusToken;
                if (token)
                    return token.card;
                return a;
            });
            return['discard {0}\'s status token', cards];
        }
        return['discard a status token', []];
    }

    eventHandler(event): void {
        event.token.card.removeStatusToken(event.token);
    }
}
