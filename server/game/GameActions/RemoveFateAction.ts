import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../basecard';
import { CardTypes, EventNames, Locations } from '../Constants';
import DrawCard from '../drawcard';
import Player from '../player';
import Ring from '../ring';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface RemoveFateProperties extends CardActionProperties {
    amount?: number;
    recipient?: DrawCard | Player | Ring;
}

export class RemoveFateAction extends CardGameAction<RemoveFateProperties> {
    name = 'removeFate';
    eventName = EventNames.OnMoveFate;
    targetType = [CardTypes.Character];
    defaultProperties: RemoveFateProperties = { amount: 1 };

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) 
        return ['removing {1} fate from {0}', [properties.amount]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) 
        return ['remove {1} fate from {0}', [properties.target, properties.amount]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        if (!(card instanceof DrawCard)) {
            return false;
        }
        let properties = this.getProperties(context, additionalProperties) 
        if (properties.amount === 0 || card.location !== Locations.PlayArea || card.getFate() === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(properties.recipient, context);
    }

    checkRecipient(origin: Player | Ring | DrawCard, context: AbilityContext): boolean {
        if (origin) {
            if (origin instanceof Player || origin instanceof Ring) {

                return true;
            }
            return origin.allowGameAction('placeFate', context);
        }
        return true;
    }

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { amount, recipient } = this.getProperties(context, additionalProperties) 
        event.fate = amount;
        event.recipient = recipient;
        event.origin = card;
        event.context = context;
    }

    checkEventCondition(event): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event, card: DrawCard, context: AbilityContext, additionalProperties): boolean {
        let { amount, recipient } = this.getProperties(context, additionalProperties) 
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === card &&
            event.recipient === recipient
        );
    }

    eventHandler(event): void {
        this.moveFateEventHandler(event);
    }
}
