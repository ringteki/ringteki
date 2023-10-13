import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

const CHARACTER = 'character';

export default class InsufferableScallywag extends DrawCard {
    static id = 'insufferable-scallywag';

    public setupCardAbilities() {
        this.action({
            title: 'Dishonor or send a character home',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.removeFateFromSelf(),
            targets: {
                [CHARACTER]: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card: DrawCard, context) =>
                        card.glory > context.source.glory && card.isParticipating()
                },
                select: {
                    dependsOn: CHARACTER,
                    mode: TargetModes.Select,
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': AbilityDsl.actions.dishonor((context) => ({
                            target: context.targets[CHARACTER]
                        })),
                        'Move this character home': AbilityDsl.actions.bow((context) => ({
                            target: context.targets[CHARACTER]
                        }))
                    }
                }
            }
        });
    }
}
