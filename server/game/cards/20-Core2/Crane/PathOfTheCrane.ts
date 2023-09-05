import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class PathOfTheCrane extends DrawCard {
    static id = 'path-of-the-crane';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('crane') && !card.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
