import { CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class DinnerInTheSky extends ProvinceCard {
    static id = 'dinner-in-the-sky';

    public setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating() && card.politicalSkill <= 2,
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
