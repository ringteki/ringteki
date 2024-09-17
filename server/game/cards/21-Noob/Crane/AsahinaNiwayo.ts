import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import { ConflictTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { ProvinceCard } from '../../../ProvinceCard';

export default class AsahinaNiwayo extends DrawCard {
    static id = 'asahina-niwayo';

    setupCardAbilities() {
        this.reaction({
            title: 'Encourage peace',
            when: {
                onConflictDeclared: ({ conflict }: { conflict: Conflict }, context) =>
                    conflict.conflictType === ConflictTypes.Military &&
                    (conflict.declaredProvince as ProvinceCard).controller === context.player
            },
            gameAction: AbilityDsl.actions.chosenDiscard((context) => ({
                amount:
                    (context.game.currentConflict as undefined | Conflict)?.getNumberOfParticipantsFor('attacker') ?? 0
            }))
        });
    }
}
