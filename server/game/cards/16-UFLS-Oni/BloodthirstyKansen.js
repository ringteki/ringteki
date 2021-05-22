const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class BloodthirstyKansen extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Resolve the contested ring',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}

BloodthirstyKansen.id = 'bloodthirsty-kansen';

module.exports = BloodthirstyKansen;
