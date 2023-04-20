import AbilityContext = require('../../../AbilityContext');
import { ConflictTypes, CardTypes, Players, TargetModes, EventNames } from '../../../Constants';
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

const TARGET_CHARACTER = 'character';

export default class NaturesWrath extends DrawCard {
    static id = 'nature-s-wrath';

    public setupCardAbilities(ability: any) {
        this.action({
            title: 'Dishonor or move home a character',
            condition: (context) =>
                context.game.isDuringConflict(ConflictTypes.Military) &&
                context.player.anyCardsInPlay((card: BaseCard) => card.isParticipating()),
            targets: {
                [TARGET_CHARACTER]: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: TARGET_CHARACTER,
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': ability.actions.dishonor((context: AbilityContext) => ({
                            target: context.targets[TARGET_CHARACTER]
                        })),
                        'Move this character home': ability.actions.sendHome((context: AbilityContext) => ({
                            target: context.targets[TARGET_CHARACTER]
                        }))
                    }
                }
            },
            then: (context) => {
                if (!context.subResolution) {
                    return {
                        target: {
                            mode: TargetModes.Select,
                            choices: {
                                'Dishonor a participating character to resolve this ability again':
                                    this.selfDishonorSelect(
                                        ability,
                                        '{0} chooses to dishonor {1} to resolve {2} again'
                                    ),
                                Done: () => true
                            }
                        },
                        then: {
                            thenCondition: (event: any) =>
                                event.origin === context.target &&
                                !event.cancelled &&
                                event.name === EventNames.OnCardDishonored,
                            gameAction: ability.actions.resolveAbility({
                                ability: context.ability,
                                subResolution: true,
                                choosingPlayerOverride: context.choosingPlayerOverride
                            })
                        }
                    };
                }
                return {
                    target: {
                        mode: TargetModes.Select,
                        choices: {
                            'Dishonor a participating character for no effect': this.selfDishonorSelect(
                                ability,
                                '{0} chooses to dishonor {1} for no effect'
                            ),
                            Done: () => true
                        }
                    }
                };
            },
            cannotTargetFirst: true,
            max: ability.limit.perConflict(1)
        });
    }

    private selfDishonorSelect(ability: any, message: string) {
        return ability.actions.selectCard((context: AbilityContext) => ({
            cardType: CardTypes.Character,
            controller: Players.Self,
            cardCondition: (card: BaseCard) => card.isParticipating(),
            gameAction: ability.actions.dishonor(),
            message: message,
            messageArgs: (card: BaseCard) => [context.player, card, context.source]
        }));
    }
}
