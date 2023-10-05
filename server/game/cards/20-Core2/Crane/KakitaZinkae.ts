import { CardTypes, TargetModes, Players, DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KakitaZinkae extends DrawCard {
    static id = 'kakita-zinkae';

    setupCardAbilities() {
        this.action({
            title: 'Add skill to conflict',
            condition: context => context.game.currentConflict.getParticipants().some(p => p.controller !== context.player),
            effect: '{1}',
            effectArgs: context => context.select === 'Give opponent +3 skill' ?
                ['add 3 to their side for this conflict'] :
                ['initiate a duel'],
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                choices: {
                    'Give opponent +3 skill': AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.changePlayerSkillModifier(3)
                    })),
                    'Duel to try and cancel': AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Select a character to duel',
                        player: Players.Opponent,
                        cardType: CardTypes.Character,
                        controller: Players.Opponent,
                        targets: false,
                        cardCondition: card => card.isParticipating(),
                        message: '{0} chooses to challenge {1} using {2}',
                        messageArgs: card => [context.player.opponent, context.source, card],
                        subActionProperties: (card) => {
                            return { target: card, challenger: context.source };
                        },
                        gameAction: AbilityDsl.actions.duel({
                            type: DuelTypes.Military,
                            swapChallengerAndTarget: true,
                            message: '{0}{1}{2}',
                            messageArgs: duel => duel.winnerController === context.player ?
                                ["add 3 to ", context.player, "\'s side for this conflict"] :
                                ["no effect", "",""],
                            gameAction: (duel) => AbilityDsl.actions.conditional({
                                condition: duel.winnerController === context.player,
                                trueGameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                                    targetController: context.player,
                                    effect: AbilityDsl.effects.changePlayerSkillModifier(3)
                                })),
                                falseGameAction: AbilityDsl.actions.noAction()
                            })
                        })
                    }))
                }
            },
        });
    }
}
