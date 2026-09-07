import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class WithstandTheDarkness extends DrawCard {
    static id = 'withstand-the-darkness';

    private currentTargets = new Set<BaseCard>();

    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => {
                    if(event.card.type !== CardType.Event || event.card.controller !== context.player.opponent) {
                        return false;
                    }
                    // chosenCardTargets covers the whole triggering, sub-resolutions included
                    const chosenTargets = event.context?.triggeringContext.chosenCardTargets ?? [];
                    this.currentTargets = new Set(
                        chosenTargets.filter((card) => this.isValidTargetForWithstand(card, context))
                    );
                    return this.currentTargets.size > 0;
                }
            },
            title: 'Place a fate on a character',
            target: {
                activePromptTitle: 'Choose a character to receive a fate',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    this.currentTargets.has(card) && this.isValidTargetForWithstand(card, context as TriggeredAbilityContext<DrawCard>),
                gameAction: AbilityDsl.actions.placeFate()
            },
            max: AbilityDsl.limit.perPhase(1)
        });
    }

    private isValidTargetForWithstand(card: BaseCard, context: TriggeredAbilityContext) {
        return (
            card.type === CardType.Character &&
            card.isFaction('crab') &&
            card.controller === context.player &&
            card.location === Location.PlayArea
        );
    }
}
