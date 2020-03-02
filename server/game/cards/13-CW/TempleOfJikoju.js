const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class TempleOfJikoju extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.rings.air.isConsideredClaimed(),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.forcedReaction({
            title: 'Place one fate on the unclaimed air ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source && context.game.rings.air.isUnclaimed()
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ target: context.game.rings.air }))
        });
    }
}

TempleOfJikoju.id = 'temple-of-jikoju';

module.exports = TempleOfJikoju;
