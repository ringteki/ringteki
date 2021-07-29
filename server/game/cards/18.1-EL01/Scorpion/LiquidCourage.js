const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class LiquidCourage extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('pride')
        });

        this.whileAttached({
            condition: context => context.game.isDuringConflict('military'),
            effect: [
                AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                AbilityDsl.effects.mustBeDeclaredAsDefender()
            ]
        });
    }
}

LiquidCourage.id = 'liquid-courage';
module.exports = LiquidCourage;
