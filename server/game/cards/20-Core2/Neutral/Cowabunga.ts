import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const CHARACTER = 'character';

export default class Cowabunga extends DrawCard {
    static id = 'cowabunga-';

    setupCardAbilities() {
        this.action({
            title: "Increase a character's military skill",
            condition: (context) => context.game.isDuringConflict('military'),
            targets: {
                [CHARACTER]: {
                    controller: Players.Self,
                    cardType: CardTypes.Character,
                    cardCondition: (card) => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: CHARACTER,
                    choices: {
                        'Gain +2 skill': AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.targets[CHARACTER],
                            effect: AbilityDsl.effects.modifyMilitarySkill(2)
                        })),
                        'Gain +4 skill, and get discarded when the conflict ends': AbilityDsl.actions.multiple([
                            AbilityDsl.actions.cardLastingEffect((context) => ({
                                target: context.targets[CHARACTER],
                                effect: [
                                    AbilityDsl.effects.modifyMilitarySkill(4),
                                    AbilityDsl.effects.delayedEffect({
                                        when: { onConflictFinished: () => true },
                                        message: '{1} is discarded from play due to the delayed effect of {0}',
                                        messageArgs: [context.source, context.targets[CHARACTER]],
                                        gameAction: AbilityDsl.actions.discardFromPlay({
                                            target: context.targets[CHARACTER]
                                        })
                                    })
                                ]
                            }))
                        ])
                    }
                }
            }
        });
    }
}
