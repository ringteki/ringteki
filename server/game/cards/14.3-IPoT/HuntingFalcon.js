const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class HuntingFalcon extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: card => card.isFacedown(),
                gameAction: AbilityDsl.actions.lookAt()
            }
        });
    }
}

HuntingFalcon.id = 'hunting-falcon';

module.exports = HuntingFalcon;
