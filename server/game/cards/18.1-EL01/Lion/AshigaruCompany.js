const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');

class AshigaruCompany extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: {
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            effect: 'look at the top five cards of their deck',
            handler: context => {
                if(context.player.conflictDeck.size() === 0) {
                    return;
                }
                const cards = context.player.conflictDeck.first(5);
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to put in your hand',
                    context: context,
                    cards: context.player.conflictDeck.first(5),
                    cardCondition: card => card.hasTrait('follower') && card.type === CardTypes.Attachment,
                    cardHandler: card => {
                        this.game.addMessage('{0} takes {1}', context.player, card);
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

AshigaruCompany.id = 'ashigaru-company';

module.exports = AshigaruCompany;
