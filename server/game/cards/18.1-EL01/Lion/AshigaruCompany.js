const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class AshigaruCompany extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: {
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                const topCards = context.player.conflictDeck.first(5);
                return ({
                    gameActions: [
                        AbilityDsl.actions.cardMenu(context => ({
                            activePromptTitle: 'Choose an attachment',
                            cards: topCards,
                            cardCondition: card => card.type === CardTypes.Attachment,
                            choices: ['Take nothing'],
                            handlers: [() => {
                                this.game.addMessage('{0} takes nothing', context.player);
                                return true;
                            }],
                            subActionProperties: card => ({ attachment: card }),
                            gameAction: AbilityDsl.actions.selectCard({
                                controller: Players.Self,
                                location: Locations.PlayArea,
                                cardType: CardTypes.Character,
                                message: '{0} chooses to attach {1} to {2}',
                                // @ts-ignore
                                messageArgs: (card, action, properties) => [context.player, properties.attachment, card],
                                gameAction: AbilityDsl.actions.attach()
                            })
                        })),
                        AbilityDsl.actions.handler({
                            handler: context => {
                                const cardsToMove = topCards.filter(a => a.location !== Locations.ConflictDeck);
                                this.putCardsOnBottom(cardsToMove, context);
                            }
                        })
                    ]
                });
            })
        });
    }

    putCardsOnBottom(cards, context) {
        if(cards.length > 0) {
            this.shuffleArray(cards);
            cards.forEach(c => {
                context.player.moveCard(c, Locations.ConflictDeck, { bottom: true });
            });
            context.game.addMessage('{0} puts {1} card{2} on the bottom of their conflict deck', context.player, cards.length, cards.length > 1 ? 's' : '');
        }

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
