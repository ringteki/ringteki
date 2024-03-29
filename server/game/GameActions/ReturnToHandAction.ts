import type { AbilityContext } from '../AbilityContext';
import { CardTypes, EventNames, Locations } from '../Constants';
import type DrawCard from '../drawcard';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface ReturnToHandProperties extends CardActionProperties {}

export class ReturnToHandAction extends CardGameAction {
    name = 'returnToHand';
    eventName = EventNames.OnCardLeavesPlay;
    effect = 'return {0} to their hand';
    cost = 'returning {0} to their hand';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return card.location === Locations.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = Locations.Hand;
    }

    eventHandler(event, additionalProperties = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}