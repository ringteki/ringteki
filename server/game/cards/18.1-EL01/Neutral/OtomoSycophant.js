const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class OtomoSycophant extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor Self',
            cost: AbilityDsl.costs.discardImperialFavor(),
            gameAction: AbilityDsl.actions.honor()
        });
    }
}

OtomoSycophant.id = 'otomo-sycophant';
module.exports = OtomoSycophant;
