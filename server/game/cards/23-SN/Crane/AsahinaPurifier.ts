import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import { EventName } from '../../../Constants.js';

export default class AsahinaPurifier extends DrawCard {
    static id = 'asahina-purifier';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Gain honor instead of losing honor',
            when: {
                onModifyHonor: (event: EventPayload<EventName.OnModifyHonor>) => event.dueToStatusToken && (event.amount ?? 0) < 0
            },
            limit: AbilityDsl.limit.perPhase(1),
            effect: 'gain 1 honor rather than having {1} lose 1 honor from a status token',
            effectArgs: context => [context.event.player],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
            ]),
        });
    }
}
