import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../basecard';
import { CardTypes, EventNames, Locations } from '../Constants';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface ReadyProperties extends CardActionProperties {}

export class ReadyAction extends CardGameAction {
    name = 'ready';
    eventName = EventNames.OnCardReadied;
    cost = 'readying {0}';
    effect = 'ready {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if ((card.location !== Locations.PlayArea && card.type !== CardTypes.Stronghold) || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.ready();
    }
}
