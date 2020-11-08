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
                    message: '{0} puts {1} into play{2}{3}',
                    messageArgs: (context, cards) => {
                        let discards = topFive.filter(a => !cards.includes(a));
                        let card = cards.length > 0 ? cards : 'nothing';
                        return [context.player, card, discards.length > 0 ? ' and discards ' : '', discards];
                    },
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.putIntoPlay(),
                        AbilityDsl.actions.moveCard(context => ({
                            target: topFive.filter(a => {
                                return !context.events[0].selectedCards.includes(a);
                            }),
                            faceup: true,
                            destination: Locations.DynastyDiscardPile
                        }))
                    ])
                });
            })
        });
    }
}

ShinjoGunso.id = 'shinjo-gunso';

module.exports = ShinjoGunso;
