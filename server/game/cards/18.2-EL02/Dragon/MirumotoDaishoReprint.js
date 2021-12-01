const DrawCard = require('../../../drawcard.js');
const { Players } = require('../../../Constants');

class MirumotoDaishoReprint extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent),
            targetController: Players.Opponent,
            effect: [
                ability.effects.cannotBidInDuels('4'),
                ability.effects.cannotBidInDuels('5')
            ]
        });
    }
}

MirumotoDaishoReprint.id = 'mirumoto-katana';

module.exports = MirumotoDaishoReprint ;
