import { CardTypes, Durations, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const CHARACTER = 'character';
const EFFECT = 'effect';

export default class WisdomOfTheWind extends DrawCard {
    static id = 'wisdom-of-the-wind';

    setupCardAbilities() {
        this.action({
            title: 'Give attached character a skill bonus',
            condition: (context) =>
                context.game.isDuringConflict() &&
                context.player.anyCardsInPlay((card: DrawCard) => card.hasTrait('shugenja')),
            targets: {
                [CHARACTER]: {
                    cardType: CardTypes.Character,
                    mode: TargetModes.Single,
                    cardCondition: (card: DrawCard) => card.isParticipating(),
                    gameAction: [
                        AbilityDsl.actions.bow(),
                        AbilityDsl.actions.conditional({
                            condition: (context) =>
                                context.player.anyCardsInPlay(
                                    (card: DrawCard) =>
                                        card.isParticipating() &&
                                        card.hasTrait('shugenja') &&
                                        card.hasTrait('fire') &&
                                        (context.target as DrawCard).type === CardTypes.Attachment
                                ),
                            trueGameAction: AbilityDsl.actions.discardFromPlay(),
                            falseGameAction: AbilityDsl.actions.noAction()
                        })
                    ]
                },
                [EFFECT]: {
                    mode: TargetModes.Select,
                    dependsOn: CHARACTER,
                    choices: {
                        'Honor it': AbilityDsl.actions.honor((context) => ({ target: context.targets[CHARACTER] })),
                        'Dishonor it': AbilityDsl.actions.dishonor((context) => ({
                            target: context.targets[CHARACTER]
                        }))
                    }
                }
            },
            then: {
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) =>
                        context.player.anyCardsInPlay(
                            (card: DrawCard) => card.hasTrait('shugenja') && card.hasTrait('air')
                        ),
                    trueGameAction: AbilityDsl.actions.chooseAction({
                        activePromptTitle: 'Make other status tokens be ignored?',
                        player: Players.Self,
                        options: {
                            Yes: {
                                action: AbilityDsl.actions.cardLastingEffect((context) => ({
                                    target: context.player.cardsInPlay.filter(
                                        (card: DrawCard) =>
                                            card.isParticipating() && card !== context.targets[CHARACTER]
                                    ),
                                    effect: [
                                        AbilityDsl.effects.honorStatusDoesNotModifySkill(),
                                        AbilityDsl.effects.honorStatusDoesNotAffectLeavePlay(),
                                        AbilityDsl.effects.taintedStatusDoesNotCostHonor()
                                    ],
                                    duration: Durations.UntilEndOfConflict
                                })),
                                message: '{0} chooses to make other status tokens be ignored'
                            },
                            No: {
                                action: AbilityDsl.actions.noAction()
                            }
                        }
                    }),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            }
        });
    }
}
