import { CardGameAction, CardActionProperties } from './CardGameAction';

import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { CardTypes, EventNames } from '../Constants';

export interface TurnCardFacedownProperties extends CardActionProperties {}

export class TurnCardFacedownAction extends CardGameAction {
    name = 'turnFacedown';
    eventName = EventNames.OnCardTurnedFacedown;
    cost = 'turning {0} facedown';
    effect = 'turn {0} facedown';
    targetType = [CardTypes.Character, CardTypes.Holding, CardTypes.Province, CardTypes.Event];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.isFaceup() && super.canAffect(card, context) && card.isInProvince();
    }

    eventHandler(event): void {
        if(event.card.controller !== event.card.owner) {
            event.card.owner.moveCard(event.card, event.card.location);
        }

        event.card.leavesPlay();
        if(event.card.isConflictProvince()) {
            event.context.game.addMessage('{0} is immediately revealed again!', event.card);
            event.card.inConflict = true;
            const revealEvent = event.context.game.actions.reveal().getEvent(event.card, event.context.game.getFrameworkContext());
            event.context.game.openThenEventWindow(revealEvent);
        } else {
            event.card.facedown = true;
        }
    }
}
