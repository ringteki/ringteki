const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class MatsuTsuko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of the next card',
            condition: context => context.source.isAttacking() && context.player.opponent && context.player.isMoreHonorable(),
            effectArgs: 'reduce the cost of their next card played this conflict by 2',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(2)
            }))
        });
    }
}

MatsuTsuko.id = 'matsu-tsuko';

module.exports = MatsuTsuko;
