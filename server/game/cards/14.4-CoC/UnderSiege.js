const DrawCard = require('../../drawcard.js');
const { Locations, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UnderSiege extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onConflictDeclared: (event, context) => context.game.currentConflict && context.game.currentConflict.defendingPlayer
            },
            effect: 'do a bunch of stuff',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Durations.UntilEndOfRound,
                    targetController: context.game.currentConflict.defendingPlayer,
                    effect: [
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            gameAction: AbilityDsl.actions.discardCard(context => {
                                let cards = [];
                                if(context.game.conflictRecord && context.game.conflictRecord.length > 0) {
                                    let conflict = context.game.conflictRecord[context.game.conflictRecord.length - 1];
                                    if(conflict.attackingPlayer && conflict.attackingPlayer.opponent) {
                                        cards = conflict.attackingPlayer.opponent.hand.value();
                                    }
                                }
                                return ({
                                    target: cards
                                });
                            })
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
                                this.game.addMessage('{0} sets their hand aside', player);
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
