const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class TempleOfOsanoWo extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.rings.earth.isConsideredClaimed(),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.forcedReaction({
            title: 'Place one fate on the unclaimed earth ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source && context.game.rings.earth.isUnclaimed()
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ target: context.game.rings.earth }))
        });
    }
}

TempleOfOsanoWo.id = 'temple-of-osano-wo';

module.exports = TempleOfOsanoWo;
