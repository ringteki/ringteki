import { Locations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RazeToTheGround extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Break the attacked province',
            cost: [
                AbilityDsl.costs.dishonor({ cardCondition: card => card.isParticipating() }),
                AbilityDsl.costs.breakProvince({ cardCondition: card => card.isFaceup() })
            ],
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
                    && event.conflict.conflictType === 'military'
                    && event.conflict.conflictProvince
                    && event.conflict.conflictProvince.location !== Locations.StrongholdProvince
            },
            gameAction: AbilityDsl.actions.break(context => ({
                target: context.game.currentConflict.conflictProvince
            }))
        });
    }
}

RazeToTheGround.id = 'raze-to-the-ground';

module.exports = RazeToTheGround;
