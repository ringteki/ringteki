import { DuelTypes } from '../../Constants';
import type { Duel } from '../../Duel';
import AbilityDsl from '../../abilitydsl';
import DrawCard from '../../drawcard';
import type Player from '../../player';

export default class MirumotoDojo extends DrawCard {
    static id = 'mirumoto-dojo';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} 1 fate from {1}{2}{3}{4}',
                messageArgs: (duel) =>
                    this.#wonByDuelist(duel)
                        ? ['discard', duel.loser, '', this.#loserOwner(duel), '']
                        : ['move', duel.loser, ' to ', this.#loserOwner(duel), "'s pool"],
                gameAction: (duel) =>
                    AbilityDsl.actions.joint(
                        duel.loser.map((loserChar) =>
                            AbilityDsl.actions.removeFate({
                                target: loserChar,
                                recipient: this.#wonByDuelist(duel) ? undefined : loserChar.owner
                            })
                        )
                    )
            }
        });
    }

    #wonByDuelist(duel: Duel): boolean {
        return duel.winner?.some((char) => char.hasTrait('duelist')) ?? false;
    }

    #loserOwner(duel: Duel): undefined | Player {
        return duel.loser?.[0]?.owner;
    }
}
