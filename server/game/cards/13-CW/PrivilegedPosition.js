const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Durations, Players } = require('../../Constants');

class PrivilegedPosition extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Your opponent may only declare 1 conflict opportunity this turn',
            when: {
                onHonorDialsRevealed: (event, context) =>
                    context.player.opponent &&
                    context.player.honorBid < context.player.opponent.honorBid
            },
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Opponent,
                effect: AbilityDsl.effects.setMaxConflicts(1)
            }),
            effect: 'limit {1} to a single conflict this turn',
            effectArgs: context => context.player.opponent
        });
    }
}

PrivilegedPosition.id = 'privileged-position';

module.exports = PrivilegedPosition;
