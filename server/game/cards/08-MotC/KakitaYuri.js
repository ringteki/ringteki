const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Durations, ConflictTypes } = require('../../Constants');

class KakitaYuri extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Political duel to stop military conflicts',
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                message: 'prevent {0} from declaring military conflicts this phase',
                messageArgs: duel => [duel.loser ? duel.losingPlayer : 'no one'],
                gameAction: duel => AbilityDsl.actions.playerLastingEffect(() => ({
                    targetController: duel.losingPlayer,
                    duration: Durations.UntilEndOfPhase,
                    effect: duel.loser ? AbilityDsl.effects.cannotDeclareConflictsOfType(ConflictTypes.Military) : []
                }))
            }
        });
    }
}

KakitaYuri.id = 'kakita-yuri';

module.exports = KakitaYuri;
