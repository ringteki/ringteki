const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Players, CardTypes } = require('../../../Constants');

class ForcedRetirement extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove the dishonor from a character, and discard it from play',
            effect: 'expiate {0}\'s misdeeds by retiring them to the nearest monatery{1} Let them contemplate their sins.',
            effectArgs: (context) => [
                context.target.fate > 0
                    ? ', recovering their ' + context.target.fate + ' fate.'
                    : '.'
            ],

            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (character) => character.isDishonored
            },
            gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.honor({ target: context.target }),
                        AbilityDsl.actions.removeFate({
                            target: context.target,
                            amount: context.target.getFate(),
                            recipient: context.target.owner
                        })
                    ]),
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.discardFromPlay({
                            target: context.target
                        }),
                        AbilityDsl.actions.gainHonor({
                            target: context.player,
                            amount: 1
                        })
                    ])
                ]
            }))
        });
    }
}

ForcedRetirement.id = 'forced-retirement';

module.exports = ForcedRetirement;
