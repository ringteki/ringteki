const { Players } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class CliffsOfTheSeaDragon extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                !context.game.conflictRecord.some(
                    (conflict) => conflict.winner === this.controller.opponent
                ),
            effect: ability.effects.playerCannot('takeFateFromRings')
        });
    }
}

CliffsOfTheSeaDragon.id = 'cliffs-of-the-sea-dragon';

module.exports = CliffsOfTheSeaDragon;
