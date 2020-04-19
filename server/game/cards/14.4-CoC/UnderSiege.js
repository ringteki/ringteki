const DrawCard = require('../../drawcard.js');
const { Locations, Durations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UnderSiege extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onConflictDeclared: (event, context) => context.game.currentConflict && context.game.currentConflict.defendingPlayer
            },
            effect: 'place {1} under siege!',
            effectArgs: context => [context.game.currentConflict.defendingPlayer],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Durations.UntilEndOfRound,
                    targetController: context.game.currentConflict.defendingPlayer === context.player ? Players.Self : Players.Opponent,
                    effect: [
                        AbilityDsl.effects.playerDelayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            gameAction: AbilityDsl.actions.chosenDiscard(() => ({
                                amount: 1000, //discard the entire hand
                                extraMessage: '{0} picks up their original hand'
                            }))
                        })
                    ]
                })),
                AbilityDsl.actions.conditional(({
                    condition: context => context.game.currentConflict.defendingPlayer.hand.size() > 0,
                    trueGameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.handler({
                            handler: context => {
                                let player = context.game.currentConflict.defendingPlayer;
                                let cards = player.hand.value();
                                this.game.addMessage('{0} sets their hand aside and draws 5 cards', player);
                                if(cards.length > 0) {
                                    cards.forEach(card => {
                                        player.moveCard(card, Locations.RemovedFromGame);
                                        card.lastingEffect(() => ({
                                            until: {
                                                onCardMoved: event => event.card === card && event.originalLocation === Locations.RemovedFromGame
                                            },
                                            match: card,
                                            effect: [
                                                AbilityDsl.effects.hideWhenFaceUp(),
                                                AbilityDsl.effects.delayedEffect({
                                                    when: {
                                                        onConflictFinished: () => true
                                                    },
                                                    gameAction: AbilityDsl.actions.moveCard({
                                                        target: card,
                                                        destination: Locations.Hand
                                                    })
                                                })
                                            ]
                                        }));
                                    });
                                }
                            }
                        }),
                        AbilityDsl.actions.draw(context => ({
                            target: context.game.currentConflict.defendingPlayer,
                            amount: 5
                        }))
                    ]),
                    falseGameAction: AbilityDsl.actions.handler({
                        handler: () => {}
                    })
                }))
            ])
        });
    }
}

UnderSiege.id = 'under-siege';

module.exports = UnderSiege;
