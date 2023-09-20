import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class PusillanimityExposed extends DrawCard {
    static id = 'pusillanimity-exposed';

    public setupCardAbilities() {
        this.reaction({
            title: 'Dishonor a character',
            when: {
                onConflictPass: (event, context) =>
                    context.player.opponent &&
                    event.conflict.attackingPlayer === context.player.opponent &&
                    context.player.opponent.cardsInPlay.some(
                        (card: DrawCard) => card.type === CardTypes.Character && !card.bowed
                    )
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}
