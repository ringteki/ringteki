import { CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class TibetanPlateau extends ProvinceCard {
    static id = 'tibetan-plateau';

    public setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            effect: 'honor {0}',
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
