import { CardGameAction, CardActionProperties } from './CardGameAction';
import { CardTypes, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import ProvinceCard = require('../provincecard');

export interface RestoreProvinceProperties extends CardActionProperties {
}

export class RestoreProvinceAction extends CardGameAction {
    name = 'restoreProvince';
    eventName = EventNames.OnRestoreProvince;
    targetType = [CardTypes.Province];
    cost = 'restoring {0}';
    effect = 'restore {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.isProvince) {
            return false;
        }
        if(!card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event, card: ProvinceCard, context: AbilityContext, additionalProperties): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
    }

    eventHandler(event): void {
        event.card.restoreProvince();
    }
}
