import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AkodoLeslie extends DrawCard {
    static id = 'akodo-leslie';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a participating character',
            when: {
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.isDefendingPlayer()
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
