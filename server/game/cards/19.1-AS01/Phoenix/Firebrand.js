const DrawCard = require('../../../drawcard.js');
const { Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');
const elementKeys = {
    cost: 'firebrand-fire-cost',
    ability: 'firebrand-fire-ability'
};

class Firebrand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve the fire ring',
            cost: AbilityDsl.costs.returnRings(1, ring => ring.hasElement(this.getCurrentElementSymbol(elementKeys.cost))),
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({
                player: context.player,
                target: context.game.rings[this.getCurrentElementSymbol(elementKeys.ability)]
            })),
            effect: 'resolve the {1} effect',
            effectArgs: context => [context.game.rings.fire]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.cost,
            prettyName: 'Ring to return',
            element: Elements.Fire
        });
        symbols.push({
            key: elementKeys.ability,
            prettyName: 'Ring to resolve',
            element: Elements.Fire
        });
        return symbols;
    }
}

Firebrand.id = 'firebrand';

module.exports = Firebrand;
