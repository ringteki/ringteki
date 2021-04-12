import { Locations, CardTypes } from '../../Constants.js';
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
                afterConflict: (event, context) => event.conflict.winner === context.player&& event.conflict.conflictType === 'military'
            },
            effect: 'break an attacked province',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince() && card.location !== Locations.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.break()
            }))
        });
    }
}

RazeToTheGround.id = 'raze-to-the-ground';

module.exports = RazeToTheGround;
