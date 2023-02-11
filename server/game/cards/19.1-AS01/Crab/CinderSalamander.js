const DrawCard = require('../../../drawcard.js');
const { Locations, Elements, Decks, TargetModes, Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

const elementKey = 'cinder-salamander-fire';

class CinderSalamander extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Shuffle this character back into the deck',
            location: Locations.DynastyDiscardPile,
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.moveCard({
                destination: Locations.DynastyDeck,
                shuffle: true
            })
        });

        this.action({
            title: 'Search other copies of this character and put them into play',
            condition: (context) =>
                this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player),

            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.deckSearch({
                    activePromptTitle: 'Select characters to put into play from your deck',
                    deck: Decks.DynastyDeck,
                    targetMode: TargetModes.UpTo,
                    numCards: 3,
                    cardCondition: (card) => this.isSalamanderCard(card),
                    shuffle: true,
                    gameAction: AbilityDsl.actions.putIntoPlay(),
                    message: '{0} finds {1} in their deck',
                    messageArgs: (context, cards) => [context.player, this.salamanderCountToText(cards.length)]
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Select characters to put into play from your provinces',
                    controller: Players.Self,
                    cardType: CardTypes.Character,
                    location: Locations.Provinces,
                    mode: TargetModes.UpTo,
                    numCards: 3,
                    cardCondition: (card) => this.isSalamanderCard(card),
                    gameAction: AbilityDsl.actions.putIntoPlay(),
                    message: '{0} finds {1} in their provinces',
                    messageArgs: (cards, player) => [player, this.salamanderCountToText(cards.length)]
                })
            ]),
            effect: 'search their deck and provinces for other copies of {0} and put them into play'
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Fire
        });
        return symbols;
    }

    isSalamanderCard(card) {
        return card.id === this.id;
    }

    salamanderCountToText(salamanderCount) {
        return salamanderCount > 1
            ? salamanderCount + ' salamanders'
            : salamanderCount === 1
                ? '1 salamander'
                : 'no salamanders';
    }
}

CinderSalamander.id = 'cinder-salamander';

module.exports = CinderSalamander;
