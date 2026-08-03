import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MushinNoShin extends DrawCard {
    static id = 'mushin-no-shin';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventName.OnInitiateAbilityEffects>, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    (event.cardTargets ?? []).some(
                        (card) =>
                            card.type === CardType.Character &&
                            card.location === Location.PlayArea &&
                            card.controller === context.player &&
                            (card as DrawCard).attachments.length >= 2
                    )
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default MushinNoShin;
