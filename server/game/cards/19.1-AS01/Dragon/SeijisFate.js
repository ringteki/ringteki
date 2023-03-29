const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class SeijisFate extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addTrait('creature'),
                AbilityDsl.effects.loseTrait('bushi'),
                AbilityDsl.effects.loseTrait('courtier'),
                AbilityDsl.effects.blank()
            ]
        });
    }
}

SeijisFate.id = 'seiji-s-fate';

module.exports = SeijisFate;
