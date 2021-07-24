const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes, DuelTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class DuelOfHaiku extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.hasTrait('courtier') && card.controller === context.player,
                gameAction: AbilityDsl.actions.sequentialContext(() => {
                    return ({
                        gameActions: [
                            AbilityDsl.actions.honor(context => ({
                                target: context.target
                            })),
                            AbilityDsl.actions.conditional({
                                condition: context => context.target.isParticipating(),
                                trueGameAction: AbilityDsl.actions.chooseAction(() => ({
                                    messages: { 'Do not duel': '{0} chooses not to initiate a duel' },
                                    choices: {
                                        'Do not duel': AbilityDsl.actions.handler({ handler: () => true }),
                                        'Initiate a duel': AbilityDsl.actions.selectCard(context => ({
                                            player: Players.Opponent,
                                            cardType: CardTypes.Character,
                                            controller: Players.Opponent,
                                            targets: true,
                                            cardCondition: card => card.isParticipating(),
                                            message: '{0} chooses to initiate a duel with {1}',
                                            messageArgs: card => [context.player.opponent, card],
                                            gameAction: AbilityDsl.actions.duel(context => ({
                                                type: DuelTypes.Political,
                                                challenger: context.target,
                                                gameAction: duel => duel.winner && AbilityDsl.actions.draw({
                                                    amount: 2,
                                                    target: duel.winner.controller
                                                })
                                            }))
                                        }))
                                    }
                                })),
                                falseGameAction: AbilityDsl.actions.handler({
                                    handler: () => true
                                }),
                            })
                        ]
                    })
                })
            },
        });
    }
}

DuelOfHaiku.id = 'duel-of-haiku';

module.exports = DuelOfHaiku;
