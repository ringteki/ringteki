const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class DiplomaticHall extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw 1 card',
            condition: context => context.game.isDuringConflict('political'),
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

DiplomaticHall.id = 'diplomatic-hall';

module.exports = DiplomaticHall;
