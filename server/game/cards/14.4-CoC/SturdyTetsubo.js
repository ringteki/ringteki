import { AbilityTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SturdyTetsubo extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Make opponent discard 1 card',
                when: {
                    afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player
                },
                gameAction: AbilityDsl.actions.chosenDiscard()
            })
        });
    }
}

SturdyTetsubo.id = 'sturdy-tetsubo';

module.exports = SturdyTetsubo;
