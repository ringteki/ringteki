import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type Player from '../../../player';

export default class FukurokushisBlessing extends DrawCard {
    static id = 'fukurokushi-s-blessing';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.card.isConflictProvince() && (context.source.controller as Player).isAttackingPlayer()
            },
            effect: "cancel the effects of {1}'s ability",
            effectArgs: (context) => context.event.card,
            gameAction: AbilityDsl.actions.cancel(),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
