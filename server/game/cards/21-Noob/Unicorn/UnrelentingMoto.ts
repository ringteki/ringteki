import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UnrelentingMoto extends DrawCard {
    static id = 'unrelenting-moto';

    public setupCardAbilities() {
        this.reaction({
            title: 'Ready self',
            when: {
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.winner === context.player.opponent
            },
            gameAction: AbilityDsl.actions.ready()
        });
    }
}
