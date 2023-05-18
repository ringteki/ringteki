import { CardTypes, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class LaplandHotel extends ProvinceCard {
    static id = 'lapland-hotel';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Any,
            match: (card) => card.type === CardTypes.Character && card.isParticipating(),
            effect: [
                AbilityDsl.effects.honorStatusDoesNotModifySkill(),
                AbilityDsl.effects.honorStatusDoesNotAffectLeavePlay(),
                AbilityDsl.effects.taintedStatusDoesNotCostHonor()
            ]
        });
    }
}
