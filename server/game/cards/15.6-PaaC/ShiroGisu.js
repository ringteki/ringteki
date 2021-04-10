const StrongholdCard = require('../../strongholdcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ShiroGisu extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            cost: AbilityDsl.costs.bowSelf(),
            condition: context => this.getCharactersWithoutFate(context) && context.player.conflictDeck.size() > 0,
            effect: 'look at the top {1} cards of their conflict deck',
            effectArgs: context => this.getCharactersWithoutFate(context),
            handler: context => {
                if(context.player.conflictDeck.size() === 0) {
                    return;
                }
                const numCards = this.getCharactersWithoutFate(context);
                const cards = context.player.conflictDeck.first(numCards);
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to put in your hand',
                    context: context,
                    cards: context.player.conflictDeck.first(numCards),
                    cardHandler: card => {
                        this.game.addMessage('{0} puts a card in their hand', context.player);
                        context.player.moveCard(card, Locations.Hand);
                        const cardsToMove = cards.filter(a => a !== card);
                        if(cardsToMove.length > 0) {
                            this.shuffleArray(cardsToMove);
                            cardsToMove.forEach(c => {
                                context.player.moveCard(c, Locations.ConflictDeck, { bottom: true });
                            });
                            context.game.addMessage('{0} puts {1} card{2} on the bottom of their conflict deck', context.player, cardsToMove.length, cardsToMove.length > 1 ? 's' : '');
                        }
                    }
                });
            }
        });
    }

    getCharactersWithoutFate(context) {
        return context.player.opponent.cardsInPlay.filter(card => card.getFate() === 0).length;
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    shuffleArray(array) {
        for(var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

ShiroGisu.id = 'shiro-gisu';

module.exports = ShiroGisu;
