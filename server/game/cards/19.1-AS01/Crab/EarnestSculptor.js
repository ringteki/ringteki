const DrawCard = require('../../../drawcard.js');
const { Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class EarnestSculptor extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                match: (card) => card.hasTrait('jade')
            })
        });
        this.action({
            title: 'Search top 5 card for a spell',
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: (card) => card.hasTrait('spell'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}

EarnestSculptor.id = 'earnest-sculptor';

module.exports = EarnestSculptor;
