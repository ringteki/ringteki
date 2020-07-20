const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players } = require('../../Constants');

class SilentOnesMonastery extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.limitHonorGainPerPhase(2)
        });
    }
}

SilentOnesMonastery.id = 'silent-ones-monastery';

module.exports = SilentOnesMonastery;
