import { ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import StrongholdCard from '../../../strongholdcard';

export default class LionBox extends StrongholdCard {
    static id = 'lion-box';

    setupCardAbilities() {
        this.action({
            title: 'Draw 2 cards',
            condition: (context) =>
                context.game.isDuringConflict(ConflictTypes.Military) &&
                context.player.anyCardsInPlay((card: BaseCard) => card.isParticipating()),
            cost: [AbilityDsl.costs.bowSelf(), AbilityDsl.costs.discardCard()],
            gameAction: AbilityDsl.actions.draw({ amount: 2 })
        });
    }
}
