const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Players, Durations, Locations, Decks } = require('../../Constants');

class FavorableAlliance extends DrawCard {
    PILENAME = 'favorable-alliance';

    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            cost: AbilityDsl.costs.variableFateCost({
                minAmount: 1,
                maxAmount: (context) => context.player.conflictDeck.size(),
                activePromptTitle: 'Choose a value for X'
            }),
            effect: 'set aside {1} card{2}',
            effectArgs: context => [context.costs.variableFateCost, context.costs.variableFateCost > 1 ? 's' : ''],
            // gameAction: AbilityDsl.actions.draw(context => ({ amount: context.costs.variableFateCost }))
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.lookAt(context=> ({
                    target: context.player.conflictDeck.first(context.costs.variableFateCost),
                    message: '{0} sets aside the top {1} card{3} from their conflict deck: {2}',
                    messageArgs: cards => [context.player, cards.length, cards, cards.length > 1 ? 's' : '']
                })),
                AbilityDsl.actions.handler({
                    handler: context => {
                        let cards = context.player.conflictDeck.first(context.costs.variableFateCost);
                        cards.forEach(card => {
                            card.owner.removeCardFromPile(card);
                            card.moveTo(Locations.RemovedFromGame);
                            context.player.removedFromGame.unshift(card);
                            context.source.lastingEffect(() => ({
                                until: {
                                    onCardMoved: event => event.card === card && event.originalLocation === Locations.RemovedFromGame
                                },
                                match: card,
                                effect: [
                                    AbilityDsl.effects.canPlayFromOwn(Locations.RemovedFromGame, [card])
                                ]
                            }));    
                        })
                    }
                })
                // AbilityDsl.actions.playerLastingEffect(context => ({
                //     targetController: Players.Self,
                //     duration: Durations.Custom,
                //     until: {
                //         onCardMoved: event => {
                //             let favorableCard = context.player.additionalPiles[this.PILENAME].contains(event.card) && event.originalLocation === Locations.RemovedFromGame;
                //             if (favorableCard) {
                //                 context.player.additionalPiles[this.PILENAME].splice(context.player.additionalPiles[this.PILENAME].indexOf(event.card), 1);
                //             }
                //             return favorableCard;
                //         }
                //     },
                //     effect: [
                //         AbilityDsl.effects.canPlayFromOwn(Locations.RemovedFromGame, context.player.conflictDeck.first(context.costs.variableFateCost)),
                //     ]
                // })),
                // AbilityDsl.actions.moveCard(context => {
                //     let cards = context.player.conflictDeck.first(context.costs.variableFateCost);
                //     if(!(this.PILENAME in context.player.additionalPiles)) {
                //         context.player.createAdditionalPile(this.PILENAME);
                //     }
                //     context.player.additionalPiles[this.PILENAME].cards = context.player.additionalPiles[this.PILENAME].cards.concat(cards);
                //     return {
                //         target: cards,
                //         destination: Locations.RemovedFromGame
                //     }
                // })
            ])
        });
    }
}

FavorableAlliance.id = 'favorable-alliance';

module.exports = FavorableAlliance;
