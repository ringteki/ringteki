const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class SeijisFate extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.blank(true),
                AbilityDsl.effects.addTrait('creature')
            ]
        });
    }
}

SeijisFate.id = 'seiji-s-fate';

module.exports = SeijisFate;


