const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class UtakuTetsukoReprint extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take 1 fate from opponent',
            limit: AbilityDsl.limit.perConflict(2),
            when: {
                onCardPlayed: (event, context) => context.player.opponent && event.player === context.player.opponent && context.source.isAttacking() &&
                    context.player.opponent.fate > 0
            },
            gameAction: AbilityDsl.actions.takeFate()
        });
    }
}

UtakuTetsukoReprint.id = 'definitely-not-tetsuko';

module.exports = UtakuTetsukoReprint;
