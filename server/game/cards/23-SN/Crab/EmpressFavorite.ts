import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class EmpressFavorite extends DrawCard {
    static id = 'empress-favorite';

    setupCardAbilities() {
        this.action({
            title: 'Take 1 honor',
            condition: (context) => context.source.isDefending() &&
                context.game.isDuringConflict('political') &&
                !!context.player.opponent &&
                !context.player.opponent.hasDeclaredConflictOfType(context, ConflictType.Military),
            gameAction: AbilityDsl.actions.takeHonor(),
        });
    }
}
