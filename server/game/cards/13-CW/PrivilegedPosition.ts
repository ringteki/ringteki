import { Durations } from '../../Constants';
import TriggeredAbilityContext = require('../../TriggeredAbilityContext');
import AbilityDsl = require('../../abilitydsl');
import DrawCard = require('../../drawcard');

export default class PrivilegedPosition extends DrawCard {
    static id = 'privileged-position';

    public setupCardAbilities() {
        this.reaction({
            title: 'Your opponent may only declare 1 conflict opportunity this turn',
            when: {
                onHonorDialsRevealed: (event, context) =>
                    event.isHonorBid &&
                    context.player.opponent &&
                    context.player.honorBid < context.player.opponent.honorBid
            },
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                duration: Durations.UntilEndOfRound,
                targetController: context.player.opponent,
                effect: AbilityDsl.effects.setMaxConflicts(1)
            })),
            effect: 'limit {1} to a single conflict this turn',
            effectArgs: (context: TriggeredAbilityContext) => context.player.opponent
        });
    }
}
