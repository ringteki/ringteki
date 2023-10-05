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
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }

    canPlay(context, playType) {
        if (context.player.anyCardsInPlay((card: DrawCard) => card.isFaction('crane'))) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}
