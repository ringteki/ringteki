import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BlessedShrine extends DrawCard {
    static id = 'blessed-shrine';

    setupCardAbilities() {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === CardTypes.Event &&
                    event.player === context.player &&
                    event.context.ability.getReducedCost(event.context) > 0
            },
            effect: 'reduce the cost of their next event by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, (card: DrawCard) => card === context.event.card)
            }))
        });
    }
}