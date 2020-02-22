const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class PeacemakersBlade extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('declareAttacker')
        });
    }

    canAttach(card) {
        if(card.getType() === CardTypes.Character && card.isAttacking()) {
            return false;
        }
        return super.canAttach(card);
    }
}

PeacemakersBlade.id = 'peacemaker-s-blade';

module.exports = PeacemakersBlade;

