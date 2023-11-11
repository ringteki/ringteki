import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AkodoAsuka extends DrawCard {
    static id = 'akodo-asuka';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
