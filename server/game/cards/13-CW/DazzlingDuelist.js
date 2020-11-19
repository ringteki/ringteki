const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Durations } = require('../../Constants');

class DazzlingDuelist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Military duel to stop a player from claiming rings',
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                message: 'prevent {0} from claiming rings this conflict',
                messageArgs: duel => [duel.loser ? duel.loser.controller : ''],
                gameAction: duel => AbilityDsl.actions.playerLastingEffect(() => ({
                    targetController: duel.loser && duel.loser.controller,
                    duration: Durations.UntilEndOfConflict,
                    effect: duel.loser ? AbilityDsl.effects.playerCannot('claimRings') : []
                }))
            }
        });
    }
}

DazzlingDuelist.id = 'dazzling-duelist';

module.exports = DazzlingDuelist;
