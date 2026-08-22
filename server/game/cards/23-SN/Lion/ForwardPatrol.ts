import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ForwardPatrol extends DrawCard {
    static id = 'forward-patrol';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Ready a character',
            target: {
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.ready()
            },
        });
    }
}
