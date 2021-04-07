const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class ShosuroDeceiver extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.gainAllAbilitiesDynamic(context => context.game.currentConflict.getParticipants(a => a.isDishonored && a !== context.source))
        });
    }
}

ShosuroDeceiver.id = 'shosuro-deceiver';

module.exports = ShosuroDeceiver;
