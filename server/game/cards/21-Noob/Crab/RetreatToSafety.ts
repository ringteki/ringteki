import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class RetreatToSafety extends DrawCard {
    static id = 'retreat-to-safety';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            condition: (context) => context.player.isDefendingPlayer(),
            gameAction: AbilityDsl.actions.sendHome((context) => ({
                target: (context.game.currentConflict as Conflict).getCharacters(context.player)
            })),
            then: () => ({
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.player.isTraitInPlay('commander'),
                    trueGameAction: AbilityDsl.actions.draw((context) => ({ target: context.player })),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            })
        });
    }
}
