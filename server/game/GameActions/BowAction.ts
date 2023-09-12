import type AbilityContext from '../AbilityContext';
import { EventNames, CardTypes, Locations } from '../Constants';
import { StrongholdCard } from '../StrongholdCard';
import type BaseCard from '../basecard';
import DrawCard from '../drawcard';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface BowActionProperties extends CardActionProperties {}

export class BowAction extends CardGameAction {
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
