const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations } = require('../../../Constants.js');

class OtterYakatabune extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw then discard a card',
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand,
                targets: true
            }),
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

OtterYakatabune.id = 'otter-yakatabune';
module.exports = OtterYakatabune;
