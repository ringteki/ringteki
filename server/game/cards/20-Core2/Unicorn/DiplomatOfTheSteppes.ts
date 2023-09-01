import { ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DiplomatOfTheSteppes extends DrawCard {
    static id = 'diplomat-of-the-steppes';

    setupCardAbilities() {
        this.action({
            title: 'Change the conflict to military',
            cost: AbilityDsl.costs.payHonor(1),
            condition: (context) =>
                (context.source as DrawCard).isParticipating() &&
                (context.player.isAttackingPlayer()
                    ? this.game.currentConflict.attackerSkill > this.game.currentConflict.defenderSkill
                    : this.game.currentConflict.defenderSkill > this.game.currentConflict.attackerSkill),
            effect: 'switch the conflict type to {1}',
            effectArgs: () => 'military',
            gameAction: AbilityDsl.actions.switchConflictType({ targetConflictType: ConflictTypes.Military })
        });
    }
}
