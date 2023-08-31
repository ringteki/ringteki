import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const CHARACTER = 'character';
const SELECT = 'select';

export default class ChroniclerOfCalamities extends DrawCard {
    static id = 'chronicler-of-calamities';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor or move home a character',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.optional(AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character })),
            cannotTargetFirst: true,
            targets: {
                [CHARACTER]: {
                    controller: Players.Opponent,
                    cardType: CardTypes.Character,
                    cardCondition: (card: DrawCard) => card.isParticipating() && !card.isUnique()
                },
                [SELECT]: {
                    mode: TargetModes.Select,
                    dependsOn: CHARACTER,
                    choices: (context) => {
                        const target = context.targets[CHARACTER];
                        if (context.costs.optionalSacrifice) {
                            return {
                                'Move it home and dishonor it': AbilityDsl.actions.multiple([
                                    AbilityDsl.actions.sendHome({ target }),
                                    AbilityDsl.actions.dishonor({ target })
                                ])
                            };
                        }

                        return {
                            'Move it home': AbilityDsl.actions.sendHome({ target }),
                            'Dishonor it': AbilityDsl.actions.dishonor({ target })
                        };
                    }
                }
            }
        });
    }
}
