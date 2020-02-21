const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class PeacemakersBlade extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker('military'),
                AbilityDsl.effects.cannotParticipateAsAttacker('political')
            ]
        });
    }

    canAttach(card) {
        if(card.getType() === CardTypes.Character && card.isAttacking()) {
            return false;
        }
        return super.canAttach(card);
    }
}

PeacemakersBlade.id = 'Peacemaker-s-Blade';

module.exports = PeacemakersBlade;

