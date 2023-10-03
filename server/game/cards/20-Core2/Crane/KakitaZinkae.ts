import { DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KakitaZinkae extends DrawCard {
    static id = 'kakita-zinkae';

    setupCardAbilities() {
        this.action({
            title: 'Military duel to stop contribution',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: (duel, context) =>
                    AbilityDsl.actions.sendHome({
                        target:
                            duel.winner?.includes(context.source) ?? false
                                ? context.game.currentConflict.getParticipants(
                                      (card: DrawCard) => !duel.isInvolved(card)
                                  )
                                : duel.loser
                    })
            }
        });
    }
}
