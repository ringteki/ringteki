import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames, CharacterStatus } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface TaintProperties extends CardActionProperties {
}

export class TaintAction extends CardGameAction {
    name = 'taint';
    eventName = EventNames.OnCardTainted;
    targetType = [CardTypes.Character, CardTypes.Province];
    cost = 'tainting {0}';
    effect = 'taint {0}';

    // getCostMessage(context: AbilityContext): [string, any[]] {
    //     let properties = this.getProperties(context) as TaintProperties;
    //     const target = Array.isArray(properties.target) ? properties.target[0] : properties.target;
    //     let arg = target.type === CardTypes.Province ? (target.facedown ? target.location : target) : target;
    //     return ['tainting {0}', [arg]];
    // }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.isTainted) {
            return false;
        }
        if(!this.targetType.includes(card.type)) {
            return false;
        }
        if(card.type === CardTypes.Character && card.location !== Locations.PlayArea) {
            return false;
        }
        if(!card.checkRestrictions('receiveTaintedToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.taint()
        event.card.game.raiseEvent(EventNames.OnStatusTokenGained, { token: event.card.getStatusToken(CharacterStatus.Tainted), card: event.card });
    }
}
