import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class FukurokushisBlessing extends DrawCard {
    static id = 'fukurokushi-s-blessing';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.source.parent && context.source.parent.isAttacking() && event.card.isConflictProvince()
            },
            effect: "cancel the effects of {1}'s ability",
            effectArgs: (context) => context.event.card,
            gameAction: AbilityDsl.actions.cancel(),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
