const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class MasterOfTheBlade extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search deck for a cheaper weapon',
            when: {
                onCardAttached: (event, context) => {
                    this.attachedWeaponCost = event.card.printedCost;
                    return event.card.parent === context.source && event.card.printedCost >= 1 && event.card.hasTrait('weapon')
                }
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 8,
                cardCondition: card => card.type === CardTypes.Attachment && card.printedCost < this.attachedWeaponCost && card.hasTrait('weapon'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}

MasterOfTheBlade.id = 'master-of-the-blade';

module.exports = MasterOfTheBlade;
