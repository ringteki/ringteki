import { CardGameAction, CardActionProperties } from './CardGameAction';
import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { Locations, CardTypes, EventNames, Players } from '../Constants';

export interface MoveToConflictProperties extends CardActionProperties {
    side?: Players
}

export class MoveToConflictAction extends CardGameAction {
    name = 'moveToConflict';
    eventName = EventNames.OnMoveToConflict;
    effect = 'move {0} into the conflict';
    targetType = [CardTypes.Character];
    defaultProperties: MoveToConflictProperties = { side: Players.Self };

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as MoveToConflictProperties;
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(!context.game.currentConflict || card.isParticipating()) {
            return false;
        }

        if (properties.side !== Players.Opponent) {
            if(card.controller.isAttackingPlayer()) {
                if(!card.canParticipateAsAttacker()) {
                    return false;
                }
            } else if(!card.canParticipateAsDefender()) {
                return false;
            }
        }
        else {
            if(card.controller.isAttackingPlayer()) {
                if(!card.canParticipateAsDefender()) {
                    return false;
                }
            } else if(!card.canParticipateAsAttacker()) {
                return false;
            }
        }

        return card.location === Locations.PlayArea;
    }

    addPropertiesToEvent(event, card: BaseCard, context: AbilityContext, additionalProperties): void {
        let properties = this.getProperties(context) as MoveToConflictProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.side = properties.side;
    }

    eventHandler(event): void {
        if (event.side !== Players.Opponent) {
            if(event.card.controller.isAttackingPlayer()) {
                event.context.game.currentConflict.addAttacker(event.card);
            } else {
                event.context.game.currentConflict.addDefender(event.card);
            }        
        }
        else {
            if(event.card.controller.isAttackingPlayer()) {
                event.context.game.currentConflict.addDefender(event.card);
            } else {
                event.context.game.currentConflict.addAttacker(event.card);
            }        
        }

    }
}
