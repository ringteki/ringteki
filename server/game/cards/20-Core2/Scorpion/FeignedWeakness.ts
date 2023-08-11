import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class FeignedWeakness extends DrawCard {
    static id = 'feigned-weakness';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardTypes.Event &&
                    context.player.opponent &&
                    context.game.isDuringConflict() &&
                    (context.player.isAttackingPlayer()
                        ? this.game.currentConflict.attackerSkill <= this.game.currentConflict.defenderSkill
                        : this.game.currentConflict.defenderSkill <= this.game.currentConflict.attackerSkill)
            },
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
