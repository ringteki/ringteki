import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DayOfBrotherHorse extends DrawCard {
    static id = 'day-of-brother-horse';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw three card',
            when: {
                onConflictPass: (event, context) =>
                    context.player === event.conflict.attackingPlayer &&
                    context.player.anyCardsInPlay((card: DrawCard) => !card.bowed)
            },
            max: AbilityDsl.limit.perConflict(1),
            gameAction: AbilityDsl.actions.draw({ amount: 3 }),
            effect: 'draw 3 cards - they take a break to celebrate their prized steeds'
        });
    }
}
