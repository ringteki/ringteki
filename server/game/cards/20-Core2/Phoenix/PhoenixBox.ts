import type AbilityContext from '../../../AbilityContext';
import { TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type Ring from '../../../ring';
import StrongholdCard from '../../../strongholdcard';

export default class PhoenixBox extends StrongholdCard {
    static id = 'phoenix-box';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve another ring effect',
            when: {
                onResolveRingElement: (event, context) => event.player === context.player
            },
            cost: [AbilityDsl.costs.bowSelf(), AbilityDsl.costs.discardCard()],
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context: AbilityContext) =>
                    ring !== (context as any).event.ring && ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            }
        });
    }
}
