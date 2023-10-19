import type BaseAction from '../../../BaseAction';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';

export default class FortressAtTheSeaOfFire extends StrongholdCard {
    static id = 'fortress-at-the-sea-of-fire';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel triggered ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    (event.context.ability as BaseAction).abilityType === 'action' &&
                    context.player.anyCardsInPlay((card: DrawCard) => card.isDefending())
            },
            cost: [AbilityDsl.costs.bowSelf(), AbilityDsl.costs.payFate(1)],
            effect: "cancel the effects of {1}'s ability",
            effectArgs: (context) => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
