const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class VenerableFortunist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 2 fate',
            condition: context => !!context.source.controller.role,
            cost: AbilityDsl.costs.returnRings(1, (ring, context) => context.player.role.getElement().some(a => ring.hasElement(a))),
            gameAction: AbilityDsl.actions.gainFate(({ amount: 2})),
            effect: 'return the {1} and gain 2 fate',
            effectArgs: context => context.costs.returnRing
        });
    }
}

VenerableFortunist.id = 'venerable-fortunist';

module.exports = VenerableFortunist;
