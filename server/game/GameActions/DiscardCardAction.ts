import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames, CardTypes } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');

export interface DiscardCardProperties extends CardActionProperties {
    refillFaceUp?: boolean;
}

export class DiscardCardAction extends CardGameAction {
    name = 'discardCard';
    eventName = EventNames.OnCardsDiscarded;
    cost = 'discarding {0}';
    effect = 'discard {0}';
    targetType = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event, CardTypes.Holding];
    defaultProperties: DiscardCardProperties = {
        refillFaceUp: false
    };

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return (card.location !== Locations.Hand || card.controller.checkRestrictions('discard', context)) && 
            super.canAffect(card, context, additionalProperties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as DrawCard[]).filter(card => this.canAffect(card, context));
        if(cards.length === 0) {
            return
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event, cards, context: AbilityContext, additionalProperties): void {
        let properties = this.getProperties(context) as DiscardCardProperties;

        if(!cards) {
            cards = properties.target;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        event.cards = cards;
        event.refillFaceUp = properties.refillFaceUp;
        event.context = context;
    }

    eventHandler(event, additionalProperties = {}): void {
        for(const card of event.cards) {
            this.checkForRefillProvince(card, event, additionalProperties);
            card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }

    isEventFullyResolved(event): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
