import { CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class SalarDeUyuni extends ProvinceCard {
    static id = 'salar-de-uyuni';

    public setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            effect: 'dishonor {0}',
            target: {
                activePromptTitle: 'Choose a character to dishonor',
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}