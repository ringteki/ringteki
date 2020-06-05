import { AbilityTypes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class Studious extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'scholar'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Draw a card',
                when: {
                    afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isParticipating()
                },
                gameAction: AbilityDsl.actions.draw()
            })
        });
    }
}

Studious.id = 'studious';

module.exports = Studious;
