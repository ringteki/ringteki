import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import ProvinceCard from '../../../provincecard';

export default class KilaueaVolcano extends ProvinceCard {
    static id = 'kilauea-volcano';

    setupCardAbilities() {
        this.action({
            title: 'Discard all attachments from a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.size() > 0
            },
            effect: 'remove all attachments from {0}',
            gameAction: AbilityDsl.actions.discardFromPlay((context) => ({
                target: context.target.attachments.toArray()
            }))
        });
    }
}
