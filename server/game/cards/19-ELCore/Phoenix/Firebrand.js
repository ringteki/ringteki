const DrawCard = require('../../../drawcard.js');
const { Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class Firebrand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve the fire ring',
            cost: AbilityDsl.costs.returnRings(1, ring => ring.hasElement(Elements.Fire)),
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({
                player: context.player,
                target: context.game.rings.fire
            })),
            effect: 'resolve the {1} effect',
            effectArgs: context => [context.game.rings.fire]
        });
    }
}

Firebrand.id = 'firebrand';

module.exports = Firebrand;
