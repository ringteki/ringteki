import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { CardType, EventName, Players, Location } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';

export default class IllusionaryTerrain extends DrawCard {
    static id = 'illusionary-terrain';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Turn province into copy of a province',
            effect: 'transform the attacked province into a copy of {0}',
            when: {
                onConflictDeclaredBeforeProvinceReveal: (event: EventPayload<EventName.OnConflictDeclaredBeforeProvinceReveal>, context: TriggeredAbilityContext) => !!event.conflict.conflictProvince && event.conflict.conflictProvince.isFacedown() &&
                    event.conflict.defendingPlayer === context.player &&
                    event.conflict.conflictProvince.location !== Location.StrongholdProvince
            },
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: context => context.player.hasAffinity('air', context) ? Players.Any : Players.Self,
                cardCondition: (card: BaseCard) => (card as ProvinceCard).isFaceup(),
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    target: context.event.card,
                    targetLocation: Location.Any,
                    effect: AbilityDsl.effects.copyProvince(context.target)
                }))
            },
        });
    }
}
