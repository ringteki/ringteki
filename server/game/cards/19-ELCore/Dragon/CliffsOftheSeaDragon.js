const { Players } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class CliffsOfTheSeaDragon extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot('takeFateFromRings')
        });
    }
}

CliffsOfTheSeaDragon.id = 'cliffs-of-the-sea-dragon';

module.exports = CliffsOfTheSeaDragon;
