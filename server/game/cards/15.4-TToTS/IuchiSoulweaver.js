const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class IuchiSoulweaver extends DrawCard {
    setupCardAbilities() {
        this.dire({
            condition: context => context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1,
            effect: [
                AbilityDsl.effects.participatesFromHome(),
                AbilityDsl.effects.contributeToConflict((card, context) => context.player)
            ]
        });
        
        this.dire({
            condition: context => !context.source.inConflict,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}

IuchiSoulweaver.id = 'iuchi-soulweaver';

module.exports = IuchiSoulweaver;
