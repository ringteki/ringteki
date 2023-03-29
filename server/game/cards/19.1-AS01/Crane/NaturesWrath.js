const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players, TargetModes, EventNames } = require('../../../Constants');

class NaturesWrath extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor or move home a character',
            condition: (context) => context.player.anyCardsInPlay((card) => card.isParticipating()),
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
                        'Dishonor this character': ability.actions.dishonor((context) => ({
                            target: context.targets.character
                        })),
                        'Move this character home': ability.actions.sendHome((context) => ({
                            target: context.targets.character
                        }))
                    }
                }
            },
            then: (context) => {
                if(!context.subResolution) {
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
                            thenCondition: (event) =>
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

    selfDishonorSelect(ability, message) {
        return ability.actions.selectCard((context) => ({
            cardType: CardTypes.Character,
            controller: Players.Self,
            cardCondition: (card) => card.isParticipating(),
            gameAction: ability.actions.dishonor(),
            message: message,
            messageArgs: (card) => [context.player, card, context.source]
        }));
    }
}

NaturesWrath.id = 'nature-s-wrath';

module.exports = NaturesWrath;
