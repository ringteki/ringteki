import { CardTypes, Players, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TwoHands extends DrawCard {
    static id = 'two-hands';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Add a character to the duel',
            duelCondition: (duel, context) => duel.challengingPlayer === context.player,
            target: {
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.duelAddParticipant((context) => ({
                    duel: context.event.duel
                })),
            }
        });
    }
}
