const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SuperiorAuthority extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Stop characters with 0 fate from counting skill',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getParticipants().filter(character => character.getFate() === 0),
                effect: AbilityDsl.effects.cardCannot('contributeSkillToConflictResolution')
            })),
            effect: 'make all participating characters with 0 fate not contribute skill to conflict resolution. This affects: {1}',
            effectArgs: context => [context.game.currentConflict.getParticipants().filter(character => character.getFate() === 0)]
        });
    }
}

SuperiorAuthority.id = 'superior-authority';

module.exports = SuperiorAuthority;
