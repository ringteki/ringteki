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
                })
            })
        });
    }
}

SearchTheArchives.id = 'search-the-archives';

module.exports = SearchTheArchives;
