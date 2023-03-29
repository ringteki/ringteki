const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class VigilantGuardian extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && context.game.currentConflict.attackerSkill === 0,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}

VigilantGuardian.id = 'vigilant-guardian';

module.exports = VigilantGuardian;
