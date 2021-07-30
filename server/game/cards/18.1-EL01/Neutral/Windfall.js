const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class Windfall extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add a fate to a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.costLessThan(3),
                gameAction: AbilityDsl.actions.placeFate()
            }
        });
    }
}

Windfall.id = 'windfall';

module.exports = Windfall;


