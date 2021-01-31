const AbilityDsl = require('../../abilitydsl.js');
const DrawCard = require('../../drawcard.js');

class CentipedeTattoo extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'monk'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('tattooed')
        });
        this.whileAttached({
            condition: () => this.parent.isParticipating() && this.game.currentConflict.loser === this.parent.controller,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}

CentipedeTattoo.id = 'centipede-tattoo';

module.exports = CentipedeTattoo;
