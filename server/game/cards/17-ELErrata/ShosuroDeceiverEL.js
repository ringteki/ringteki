const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ShosuroDeceiverEL extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.gainAllAbilitiesDynamic((card, context) => {
                return context.game.currentConflict.getParticipants(a => a.isDishonored && a !== card);
            })
        });
    }
}

ShosuroDeceiverEL.id = 'shosuro-deceiver-el';

module.exports = ShosuroDeceiverEL;
