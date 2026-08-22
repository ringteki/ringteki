import { DuelType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class IkomaUjio extends DrawCard {
    static id = 'ikoma-ujio';

    setupCardAbilities() {
        this.conflictAction({
            conflictType: 'political',
            title: 'Military duel to bow',
            initiateDuel: {
                type: DuelType.Military,
                message: '{0} chooses whether to bow {1} or give 1 honor to {2}',
                messageArgs: duel => [duel.loserController, duel.loser, duel.winnerController],
                gameAction: (duel, context) => AbilityDsl.actions.chooseAction({
                    target: duel.loser,
                    player: duel.loserController !== context.source.controller ? Players.Opponent : Players.Self,
                    options: {
                        'Give opponent 1 honor': {
                            action: AbilityDsl.actions.takeHonor({
                                target: duel.loserController
                            }),
                            message: '{0} chooses to give 1 honor to {1}',
                        },
                        'Bow this character': {
                            action: AbilityDsl.actions.bow(),
                            message: '{0} chooses to bow {1}'
                        }
                    }
                })
            }
        });
    }
}
