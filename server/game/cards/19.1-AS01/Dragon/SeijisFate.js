const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class SeijisFate extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.blank(),
                AbilityDsl.effects.addTrait('creature'),
                AbilityDsl.effects.loseTrait('courtier')
            ]
        });
    }
}

SeijisFate.id = 'seiji-s-fate';

module.exports = SeijisFate;


