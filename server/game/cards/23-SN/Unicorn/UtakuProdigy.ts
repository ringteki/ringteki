import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import { EventName } from '../../../Constants.js';

export default class UtakuProdigy extends DrawCard {
    static id = 'utaku-prodigy';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });

        this.wouldInterrupt({
            title: 'Gain 2 honor instead',
            when: {
                onModifyHonor: (event: EventPayload<EventName.OnModifyHonor>, context) => event.dueToStatusToken && (event.amount ?? 0) > 0 && event.player === context.player
            },
            effect: 'instead gain 2 honor from the status token',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player, amount: 2 }))
            ]),
        });
    }
}
