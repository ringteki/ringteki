import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { CardType, Players, Location } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';

export default class IllusionaryTerrain extends DrawCard {
    static id = 'illusionary-terrain';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) => {
                    return player.filterCardsInPlay((card) => {
                        return card.hasTrait('shugenja');
                    }).length;
                },
                match: (card, source) => card === source
            })
        });

        this.wouldInterrupt({
            title: 'Turn province into copy of a province',
            effect: 'transform the attacked province into a copy of {0}',
            when: {
                onConflictDeclaredBeforeProvinceReveal: () => true
            },
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: (context) => {
                    if(context.player.hasAffinity('air', context)) {
                        return Players.Any;
                    }
                    const conflict = (context as TriggeredAbilityContext<DrawCard>).event.conflict;
                    return conflict?.defendingPlayer === context.player ? Players.Self : Players.Opponent;
                },
                cardCondition: (card: BaseCard, context) => (card as ProvinceCard).isFaceup() &&
                    card !== (context as TriggeredAbilityContext<DrawCard>).event.conflict?.conflictProvince,
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    target: context.event.conflict.conflictProvince,
                    targetLocation: Location.Any,
                    effect: AbilityDsl.effects.copyProvince(context.target)
                }))
            }
        });
    }
}
