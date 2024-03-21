import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../basecard';
import { CardTypes, EventNames, Locations } from '../Constants';
import DrawCard from '../drawcard';
import { StrongholdCard } from '../StrongholdCard';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface BowActionProperties extends CardActionProperties {}

export class BowAction extends CardGameAction<BowActionProperties> {
    name = 'bow';
    eventName = EventNames.OnCardBowed;
    cost = 'bowing {0}';
    effect = 'bow {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return (
            (card instanceof StrongholdCard || (card instanceof DrawCard && card.location === Locations.PlayArea)) &&
            !card.bowed &&
            super.canAffect(card, context)
        );
    }

    eventHandler(event): void {
        event.card.bow();
    }
}