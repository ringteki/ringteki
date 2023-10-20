import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';

export default class MomijiHalls extends StrongholdCard {
    static id = 'momiji-halls';

    setupCardAbilities() {
        this.action({
            title: 'Draw 2 cards',
            condition: (context) => context.player.anyCardsInPlay((card: BaseCard) => card.isAttacking('military')),
            cost: [AbilityDsl.costs.bowSelf(), AbilityDsl.costs.discardCard()],
            gameAction: AbilityDsl.actions.draw({ amount: 2 })
        });
    }
}
