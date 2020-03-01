const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class InscribedTanto extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.game.rings.void.isConsideredClaimed(context.player),
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsRingEffects'
            })
        });
    }
}

InscribedTanto.id = 'inscribed-tanto';

module.exports = InscribedTanto;
