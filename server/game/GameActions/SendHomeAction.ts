import { CardGameAction, CardActionProperties } from './CardGameAction';
import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { CardTypes, EffectNames, EventNames } from '../Constants';

export interface SendHomeProperties extends CardActionProperties {
}

export class SendHomeAction extends CardGameAction {
    name = 'sendHome';
    eventName = EventNames.OnSendHome;
    cost = 'moving home {0}';
    effect = 'send {0} home';
    targetType = [CardTypes.Character];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return super.canAffect(card, context) && card.isParticipating() && !card.anyEffect(EffectNames.ParticipatesFromHome);
    }

    eventHandler(event): void {
        event.context.game.currentConflict.removeFromConflict(event.card);
    }
}
