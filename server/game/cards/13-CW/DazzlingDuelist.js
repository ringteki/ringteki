const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Durations, Players } = require('../../Constants');

class DazzlingDuelist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Military duel to stop a player from claiming rings',
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: duel.loser && duel.loser.controller === context.player ? Players.Self : Players.Opponent,
                    duration: Durations.UntilEndOfConflict,
                    effect: duel.loser ? AbilityDsl.effects.playerCannot('claimRings') : []
                }))
            }
        });
    }
}

DazzlingDuelist.id = 'dazzling-duelist';

module.exports = DazzlingDuelist;
