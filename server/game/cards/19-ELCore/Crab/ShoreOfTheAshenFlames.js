const AbilityDsl = require('../../../abilitydsl.js');
const ProvinceCard = require('../../../provincecard.js');

class ShoreOfTheAshenFlames extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring',
            when: {
                afterConflict: (event) => !event.conflict.isBreaking()
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}

ShoreOfTheAshenFlames.id = 'shore-of-the-ashen-flames';

module.exports = ShoreOfTheAshenFlames;
