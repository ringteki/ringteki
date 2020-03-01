const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class TalismanOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move conflict to a different province',
            condition: context => context.player.isDefendingPlayer(),
            cost: ability.costs.bowSelf(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}

TalismanOfTheSun.id = 'talisman-of-the-sun';

module.exports = TalismanOfTheSun;
