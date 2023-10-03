import { CardTypes } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class KilaueaVolcano extends ProvinceCard {
    static id = 'kilauea-volcano';

    setupCardAbilities() {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card) =>  card.parent?.type === CardTypes.Character && card.parent.isParticipating(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
