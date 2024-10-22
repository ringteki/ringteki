import AbilityDsl from '../../../abilitydsl';
import { Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { RingEffects } from '../../../RingEffects';

export default class CalmInTheMidstOfThunder extends DrawCard {
    static id = 'calm-in-the-midst-of-thunder';

    setupCardAbilities() {
        this.action({
            title: 'Resolve a ring effect',
            condition: (context) => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.discardStatusToken({ cardCondition: (card) => card.isParticipating() }),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                ringCondition: (ring, context) =>
                    RingEffects.contextFor(context.player, ring.element, false).ability.hasLegalTargets(context),
                gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({ player: context.player }))
            },
            effect: "resolve the {0}'s effect"
        });
    }
}
