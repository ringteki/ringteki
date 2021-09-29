const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class LuckyCoin extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.game.isDuringConflict() && context.source.parent && context.source.parent.isDishonored,
            effect: [
                AbilityDsl.effects.honorStatusDoesNotModifySkill(),
                AbilityDsl.effects.honorStatusDoesNotAffectLeavePlay()
            ]
        });
    }
}

LuckyCoin.id = 'lucky-coin';

module.exports = LuckyCoin;
