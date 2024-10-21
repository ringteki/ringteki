import AbilityDsl from '../../../abilitydsl';
import { DuelTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class ShochuBrawl extends DrawCard {
    static id = 'shochu-brawl';

    setupCardAbilities() {
        this.action({
            title: 'Gain +1 military for each bushi character',
            condition: (context) => context.game.isDuringConflict('political'),
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: (duel) =>
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.bow({ target: duel.loser }),
                        AbilityDsl.actions.dishonor({ target: duel.winner })
                    ])
            },
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
