const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class TempleOfTheThunders extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.rings.fire.isConsideredClaimed(),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.forcedReaction({
            title: 'Place one fate on the unclaimed fire ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source && context.game.rings.fire.isUnclaimed()
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ target: context.game.rings.fire }))
        });
    }
}

TempleOfTheThunders.id = 'temple-of-the-thunders';

module.exports = TempleOfTheThunders;
