import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class EmpressFavorite extends DrawCard {
    static id = 'empress-favorite';

    setupCardAbilities() {
        this.conflictAction({
            conflictType: 'political',
            title: 'Take 1 honor',
            condition: (context) => context.source.isDefending() &&
                !!context.player.opponent &&
                !context.player.opponent.hasDeclaredConflictOfType(context, ConflictType.Military),
            gameAction: AbilityDsl.actions.takeHonor(),
        });
    }
}
