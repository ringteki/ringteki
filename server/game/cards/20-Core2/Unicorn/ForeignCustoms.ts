import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ForeignCustoms extends DrawCard {
    static id = 'foreign-customs';

    setupCardAbilities() {
        this.action({
            title: 'Ready a non-unicorn character',
            condition: (context) =>
                context.player.stronghold?.isFaction('unicorn') ||
                context.player.anyCardsInPlay((card: DrawCard) => card.isFaction('unicorn')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => !card.isFaction('unicorn') && card.isAtHome(),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
