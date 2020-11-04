import { CardTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const { Locations, Decks } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ShinjoGunso extends DrawCard {
    setupCardAbilities() {
        this.chosenCard = null;
        this.reaction({
            title: 'Put a character into play',
            when: {
                onCardPlayed: (event, context) =>
                    event.card === context.source &&
                    [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(event.originalLocation)
            },
            effect: 'search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play',
            gameAction: AbilityDsl.actions.deckSearch(context => {
                let topFive = context.player.dynastyDeck.first(5);
                return ({
                    activePromptTitle: 'Choose a character to put into play ',
                    amount: 5,
                    deck: Decks.DynastyDeck,
                    cardCondition: card => card.type === CardTypes.Character && card.printedCost <= 2,
                    message: '{0} puts {1} into play and discards {2}',
                    messageArgs: (context, cards) => [context.player, cards, topFive.filter(a => !cards.includes(a))],
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.putIntoPlay(),
                        AbilityDsl.actions.moveCard(context => ({
                            target: topFive.filter(a => {
                                return !context.events[0].selectedCards.includes(a)
                            }),
                            faceup: true,
                            destination: Locations.DynastyDiscardPile,
                        }))
                    ])
                })
            }),
            // gameAction: AbilityDsl.actions.cardMenu(context => ({
            //     activePromptTitle: 'Choose a character that costs 2 or less',
            //     cards: context.player.dynastyDeck.first(5),
            //     cardCondition: card => card.type === CardTypes.Character && card.printedCost <= 2,
            //     choices: ['Don\'t choose a character'],
            //     handlers: [
            //         function() {
            //             context.player.dynastyDeck.first(5).forEach(card => {
            //                 context.player.moveCard(card, Locations.DynastyDiscardPile);
            //             });
            //             context.game.addMessage('{0} chooses not to put a character into play', context.player);
            //         }
            //     ],
            //     subActionProperties: card => ({ target: card }),
            //     message: '{0} chooses to put {1} into play',
            //     messageArgs: (card, player) => [player, card],
            //     gameAction: AbilityDsl.actions.sequential([
            //         AbilityDsl.actions.putIntoPlay(),
            //         AbilityDsl.actions.moveCard((context) => ({
            //             target: context.player.dynastyDeck.first(4),
            //             faceup: true,
            //             destination: Locations.DynastyDiscardPile
            //         }))
            //     ])
            // }))
        });
    }
}

ShinjoGunso.id = 'shinjo-gunso';

module.exports = ShinjoGunso;
