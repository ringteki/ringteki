const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class InsatiableGaki extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Make opponent discard a card',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            gameAction: AbilityDsl.actions.chosenDiscard({ amount: 1 })
        });
    }
}

InsatiableGaki.id = 'insatiable-gaki';

module.exports = InsatiableGaki;
