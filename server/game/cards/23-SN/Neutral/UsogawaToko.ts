import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class UsogawaToko extends DrawCard {
    static id = 'usogawa-toko';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Give a participating character -3 glory',
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyGlory(-3)
                }))
            },
            effect: 'give {0} -3 glory until the end of the conflict'
        });
    }
}
