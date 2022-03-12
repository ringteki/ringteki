const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class CommandByTitle extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce Province Strength',
            condition: context => context.game.isDuringConflict(),
            effect: 'reduce the strength of an attacked province',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: card => card.isConflictProvince(),
                    message: '{0} reduces the strength of {1} by 2',
                    messageArgs: cards => [context.player, cards],
                    gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                        targetLocation: Locations.Provinces,
                        effect: AbilityDsl.effects.modifyProvinceStrength(-2)
                    }))
                })),
                AbilityDsl.actions.chooseAction(context => ({
                    messages: {
                        'Draw a card': '{0} chooses to lose 1 honor to draw a card',
                        'Gain an honor': '{0} chooses to discard a card to gain 1 honor'
                    },
                    choices: {
                        'Draw a card': AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseHonor({ target: context.player }),
                            AbilityDsl.actions.draw({ target: context.player })
                        ]),
                        'Gain an honor': AbilityDsl.actions.joint([
                            AbilityDsl.actions.gainHonor({ target: context.player }),
                            AbilityDsl.actions.chosenDiscard({ target: context.player })
                        ])
                    }
                }))
            ])
        });
    }
}

CommandByTitle.id = 'command-by-title';

module.exports = CommandByTitle;
