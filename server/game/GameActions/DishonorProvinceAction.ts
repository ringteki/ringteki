import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface DishonorProvinceProperties extends CardActionProperties {
}

export class DishonorProvinceAction extends CardGameAction {
    name = 'dishonor';
    eventName = EventNames.OnCardDishonored;
    targetType = [CardTypes.Province];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.type !== CardTypes.Province || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.dishonor()
    }
}
