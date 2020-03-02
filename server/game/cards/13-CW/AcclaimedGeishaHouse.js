const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AcclaimedGeishaHouse extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch the contested ring',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.dishonor({ cardCondition: card => card.isParticipating() }),
            gameAction: AbilityDsl.actions.selectRing({
                message: '{0} switches the contested ring with {1}',
                messageArgs: (ring, player) => [player, ring],
                gameAction: AbilityDsl.actions.switchConflictElement()
            }),
            effect: 'switch the contested ring with an unclaimed one'
        });
    }
}

AcclaimedGeishaHouse.id = 'acclaimed-geisha-house';

module.exports = AcclaimedGeishaHouse;
