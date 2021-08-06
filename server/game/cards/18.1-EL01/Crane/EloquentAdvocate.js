const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Durations, DuelTypes } = require('../../../Constants');

class EloquentAdvocate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

EloquentAdvocate.id = 'eloquent-advocate';
module.exports = EloquentAdvocate;

