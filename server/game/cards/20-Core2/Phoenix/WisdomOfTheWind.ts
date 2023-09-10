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
            effect: 'honor or dishonor {0}',
            condition: (context) =>
                context.game.isDuringConflict() &&
                context.player.anyCardsInPlay((card: DrawCard) => card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.isParticipating(),
                gameAction: AbilityDsl.actions.chooseAction({
                    options: {
                        'Honor this character': {
                            action: AbilityDsl.actions.honor(),
                            message: '{0} chooses to honor {1}'
                        },
                        'Dishonor this character': {
                            action: AbilityDsl.actions.dishonor(),
                            message: '{0} chooses to dishonor {1}'
                        }
                    }
                })
            },
            then: {
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) =>
                        context.player.anyCardsInPlay(
                            (card: DrawCard) => card.hasTrait('shugenja') && card.hasTrait('air')
                        ),
                    // TODO: This needs to be a lasting effect on the conflict, not only the current participating characters
                    trueGameAction: AbilityDsl.actions.chooseAction({
                        activePromptTitle: 'Make other status tokens be ignored?',
                        player: Players.Self,
                        options: {
                            Yes: {
                                action: AbilityDsl.actions.cardLastingEffect((context) => ({
                                    target: context.game.currentConflict.getAttackers().concat(context.game.currentConflict.getDefenders()).filter(
                                        (card: DrawCard) => card !== context.target
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
