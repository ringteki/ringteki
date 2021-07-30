const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class Yuta extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.getFate() >= 2,
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });
    }
}

Yuta.id = 'yuta';
module.exports = Yuta;
