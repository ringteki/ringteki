const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class MatsuAgetoki extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player && context.player.opponent && context.player.honor > context.player.opponent.honor && context.source.isAttacking(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}

MatsuAgetoki.id = 'matsu-agetoki';

module.exports = MatsuAgetoki;
