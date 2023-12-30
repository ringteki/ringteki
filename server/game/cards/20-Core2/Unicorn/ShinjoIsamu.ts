import { TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';
import type Ring from '../../../ring';
import type { AbilityContext } from '../../../AbilityContext';
import type { ProvinceCard } from '../../../ProvinceCard';

export default class ShinjoIsamu extends DrawCard {
    static id = 'shinjo-isamu';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve a ring effect',
            when: {
                onSendHome: (event, context) => event.card === context.source,
                onReturnHome: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context: AbilityContext) =>
                    ring.isUnclaimed() &&
                    (context.game.currentConflict as Conflict)
                        .getConflictProvinces()
                        .some((province: ProvinceCard) => province.getElement().includes(ring.element)),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            },
            effect: 'resolve the {0} effect'
        });
    }
}
