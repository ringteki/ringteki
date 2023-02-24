const { Players } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class CliffsOfTheSeaDragon extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                !context.game.conflictRecord.some((conflict) => this.cliffsTurnOffCondition(context, conflict)),
            effect: ability.effects.playerCannot('takeFateFromRings')
        });
    }

    cliffsTurnOffCondition(context, conflict) {
        let lostByDragon = conflict.winner === context.source.controller.opponent;
        let passedByAnyone = conflict.passed;
        return lostByDragon || passedByAnyone;
    }
}

CliffsOfTheSeaDragon.id = 'cliffs-of-the-sea-dragon';

module.exports = CliffsOfTheSeaDragon;
