const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class AncientGolem extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cardCannot('declareAsAttacker')
            ]
        });

        this.interrupt({
            title: 'Dishonor a character and draw a card',
            anyPlayer: true,
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            cost: AbilityDsl.costs.dishonor(),
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

AncientGolem.id = 'ancient-golem';

module.exports = AncientGolem;
