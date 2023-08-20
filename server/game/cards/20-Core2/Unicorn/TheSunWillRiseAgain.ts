import { Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TheSunWillRiseAgain extends DrawCard {
    static id = 'the-sun-will-rise-again';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain an additional coflict',
            when: {
                onConflictFinished: (event, context) => context.player.isAttackingPlayer() && event.conflict.winner === context.player.opponent
                    && event.conflict.skillDifference >= 5
            },
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict(context.game.currentConflict.conflictType)
            })),
            effect: 'gain an additional {1} conflict this round. They will not forget this defeat.',
            effectArgs: context => [context.game.currentConflict.conflictType]
        });
    }
}
