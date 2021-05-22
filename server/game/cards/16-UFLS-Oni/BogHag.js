const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class BogHag extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Resolve the contested ring',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating() && context.player.opponent && context.player.opponent.conflictDeck.size() > 0;
                }
            },
            gameAction: AbilityDsl.actions.discardCard(context => ({ target: context.player.opponent.conflictDeck.first(8) })),
            effect: 'discard the top 8 cards of {1}\'s conflict deck',
            effectArgs: context => [context.player.opponent]
        });
    }
}

BogHag.id = 'bog-hag';

module.exports = BogHag;
