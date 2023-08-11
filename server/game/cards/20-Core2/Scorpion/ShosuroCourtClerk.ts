import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShosuroCourtClerk extends DrawCard {
    static id = 'shosuro-court-clerk';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && this.game.currentConflict.winner === context.player,
            effect: AbilityDsl.effects.forceConflictUnopposed()
        });
    }
}
