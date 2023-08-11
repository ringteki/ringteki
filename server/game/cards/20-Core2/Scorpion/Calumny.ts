import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Calumny extends DrawCard {
    static id = 'calumny-';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor a participating character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}
