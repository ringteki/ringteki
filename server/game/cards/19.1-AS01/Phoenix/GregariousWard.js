const AbilityDsl = require('../../../abilitydsl.js');
const DrawCard = require('../../../drawcard.js');

class GregariousWard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain fate',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.game.currentConflict.hasMoreParticipants(context.player)
            },
            gameAction: AbilityDsl.actions.placeFate(),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}

GregariousWard.id = 'gregarious-ward';

module.exports = GregariousWard;
