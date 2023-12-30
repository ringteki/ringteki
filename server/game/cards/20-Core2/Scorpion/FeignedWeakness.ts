import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { Conflict } from '../../../conflict';
import type Player from '../../../player';

export default class FeignedWeakness extends DrawCard {
    static id = 'feigned-weakness';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardTypes.Event &&
                    context.game.isDuringConflict() &&
                    this.#hasEqualOrLessSkill(this.game.currentConflict, context.player)
            },
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand,
                cardCondition: (card, context) => card !== context.source
            }),
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    #hasEqualOrLessSkill(conflict: Conflict, player: Player): boolean {
        return conflict.defendingPlayer === player
            ? conflict.attackerSkill >= conflict.defenderSkill
            : conflict.defenderSkill >= conflict.attackerSkill;
    }
}
