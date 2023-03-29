const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Locations } = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');

class UndergroundOphidiarium extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for a Poison',
            effect: 'search conflict deck to reveal a poison attachment and add it to their hand',
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.deckSearch({
                cardCondition: (card) =>
                    card.type === CardTypes.Attachment &&
                    card.hasTrait('poison'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}

UndergroundOphidiarium.id = 'underground-ophidiarium';

module.exports = UndergroundOphidiarium;
