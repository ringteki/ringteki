const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RovingMichibiku extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take a ring from opponent\'s claimed pool',
            when: {
                afterConflict: (event, context) => context.source.isAttacking() && event.conflict.winner === context.source.controller && context.player.opponent
            },
            gameAction: AbilityDsl.actions.selectRing(context => ({
                activePromptTitle: 'Choose a ring to take',
                ringCondition: ring => context.player.opponent && ring.claimedBy === context.player.opponent.name,
                message: '{0} takes {1}',
                messageArgs: ring => [context.player, ring],
                gameAction: AbilityDsl.actions.takeRing()
            }))
        });
    }
}

RovingMichibiku.id = 'roving-michibiku';

module.exports = RovingMichibiku;
