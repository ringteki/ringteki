import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CoerceThroughShame extends DrawCard {
    static id = 'coerce-through-shame';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor or bow a character',
            condition: (context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.isParticipating() && card.hasTrait('courtier')),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': AbilityDsl.actions.dishonor((context) => ({
                            target: context.targets.character
                        })),
                        'Bow this character': AbilityDsl.actions.bow((context) => ({
                            target: context.targets.character
                        }))
                    }
                }
            }
        });
    }
}
