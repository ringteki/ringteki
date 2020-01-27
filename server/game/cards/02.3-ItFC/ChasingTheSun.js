const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, EventNames, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ChasingTheSun extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player.isAttackingPlayer(),
            cannotBeMirrored: true,
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            },
        });
    }
}

ChasingTheSun.id = 'chasing-the-sun';

module.exports = ChasingTheSun;
