const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PeacemakersBlade extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker('military'),
                AbilityDsl.effects.cannotParticipateAsAttacker('political')
            ]
        });
    }

    canPlay(context, playType) {
        if(this.game.currentConflict) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

PeacemakersBlade.id = 'Peacemaker-s-Blade';

module.exports = PeacemakersBlade;

