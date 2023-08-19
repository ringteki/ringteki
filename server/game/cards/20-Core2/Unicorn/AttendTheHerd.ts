import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AttendTheHerd extends DrawCard {
    static id = 'attend-the-herd';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw three card',
            when: {
                onConflictPass: (event, context) => context.player === event.conflict.attackingPlayer
            },
            max: AbilityDsl.limit.perConflict(1),
            gameAction: AbilityDsl.actions.draw({ amount: 3 }),
            effect: 'draw 3 cards, take it easy and attend the horses. It\'s a beautiful day after all.'
        });
    }
}
