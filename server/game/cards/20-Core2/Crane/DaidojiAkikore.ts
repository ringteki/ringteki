import { DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DaidojiAkikore extends DrawCard {
    static id = 'daidoji-akikore';

    setupCardAbilities() {
        this.action({
            title: 'Military duel to add skill',
            initiateDuel: context => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                challengerCondition: (card, context) => context.game.isDuringConflict(),
                message: '{0}{1}{2}',
                messageArgs: (duel) =>
                    duel.winningPlayer === context.player
                        ? ['add 3 to ', context.player, "'s side for this conflict"]
                        : ['no effect', '', ''],
                gameAction: (duel) => AbilityDsl.actions.conditional({
                    condition: duel.winningPlayer === context.player,
                    trueGameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                        targetController: duel.winningPlayer,
                        effect: AbilityDsl.effects.changePlayerSkillModifier(3)
                    })),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            })
        });
    }
}
