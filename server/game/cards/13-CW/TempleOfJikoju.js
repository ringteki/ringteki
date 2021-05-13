const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Elements } = require('../../Constants');

class TempleOfJikoju extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.rings[this.getCurrentElementSymbol('temple-of-jikoju-air-0')].isConsideredClaimed(),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.forcedReaction({
            title: 'Place one fate on the unclaimed ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source && context.game.rings[this.getCurrentElementSymbol('temple-of-jikoju-air-1')].isUnclaimed()
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ target: context.game.rings[this.getCurrentElementSymbol('temple-of-jikoju-air-1')] }))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'temple-of-jikoju-air-0',
            prettyName: 'Strength Bonus',
            element: Elements.Air
        });
        symbols.push({
            key: 'temple-of-jikoju-air-1',
            prettyName: 'Fate Ring',
            element: Elements.Air
        });
        return symbols;
    }
}

TempleOfJikoju.id = 'temple-of-jikoju';

module.exports = TempleOfJikoju;
