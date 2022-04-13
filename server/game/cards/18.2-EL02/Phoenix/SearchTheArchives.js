const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations } = require('../../../Constants.js');

class SearchTheArchives extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search your deck for a card',
            when: {
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 4,
                cardCondition: card => card.hasTrait('spell') || card.hasTrait('kiho'),
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                }),
                remainingCardsHandler: (context, event, cards) => {
                    this.selectPrompt(context, cards, []);
                }
            })
        });
    }

    selectPrompt(context, cards, sortedCards) {
        if(!cards || cards.length <= 0) {
            let tops = sortedCards.filter(a => a.location === 'top').map(a => a.card).reverse();
            let bottoms = sortedCards.filter(a => a.location === 'bottom').map(a => a.card);
            bottoms.forEach(c => {
                context.player.moveCard(c, Locations.ConflictDeck, { bottom: true });
            });
            context.player.conflictDeck.splice(0, tops.length, ...tops);
            return;
        }
        let cardHandler = currentCard => {
            let baseHandler = (card, location) => {
                this.game.addMessage('{0} puts a card on the {1} of their deck', context.player, location);
                sortedCards.push({ card: card, location: location });
                cards = cards.filter(a => a !== card);
                this.selectPrompt(context, cards, sortedCards);
            };

            let handlers = [
                () => baseHandler(currentCard, 'top'),
                () => baseHandler(currentCard, 'bottom')
            ];

            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Place this card on the top or bottom of your deck?',
                context: context,
                choices: ['Top', 'Bottom'],
                handlers: handlers
            });
        };

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to place',
            context: context,
            cards: cards,
            cardHandler: cardHandler,
            handlers: [],
            choices: []
        });
    }
}

SearchTheArchives.id = 'search-the-archives';

module.exports = SearchTheArchives;
