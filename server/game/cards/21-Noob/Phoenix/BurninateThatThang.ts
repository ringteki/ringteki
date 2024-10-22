import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class BurninateThatThang extends DrawCard {
    static id = 'burninate-that-thang';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +2/+2',
            condition: (context) => context.player.anyCardsInPlay((card) => card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.action.modifyBothSkills(2)
            }
        });
    }
}
