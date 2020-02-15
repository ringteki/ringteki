const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class TempleOfShinseisWisdom extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.rings.void.isConsideredClaimed(),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.forcedReaction({
            title: 'Place one fate on the unclaimed void ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source && context.game.rings.void.isUnclaimed()
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ target: context.game.rings.void }))
        });
    }
}

TempleOfShinseisWisdom.id = 'temple-of-shinsei-s-wisdom';

module.exports = TempleOfShinseisWisdom;
