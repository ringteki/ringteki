import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Location, PlayType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class DragonTattoo extends DrawCard {
    static id = 'dragon-tattoo';

    private cardPlayed = true;

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('tattooed') });

        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event &&
                    event.card.controller === context.player &&
                    (event.card.location === Location.ConflictDiscardPile ||
                        event.card.location === Location.DynastyDiscardPile) &&
                    // chosenCardTargets covers the whole triggering, sub-resolutions included
                    (event.context?.triggeringContext.chosenCardTargets ?? []).some((card) =>
                        this.isValidTargetForTattoo(card, context))
            },
            title: 'Play card again',
            gameAction: AbilityDsl.actions.ifAble((context) => {
                const card = context.event.card;
                return {
                    ifAbleAction: AbilityDsl.actions.playCard(() => {
                        this.cardPlayed = true;
                        return {
                            source: this,
                            target: card,
                            resetOnCancel: true,
                            playType: PlayType.Other,
                            destination: Location.RemovedFromGame,
                            payCosts: true,
                            allowReactions: true
                        };
                    }),
                    otherwiseAction: AbilityDsl.actions.moveCard(() => {
                        this.cardPlayed = false;
                        return {
                            target: card,
                            destination: Location.RemovedFromGame
                        };
                    })
                };
            }),
            effect: '{1}{2}{3}',
            effectArgs: (context) => [
                this.cardPlayed ? 'play ' : 'remove ',
                context.event.card?.name ?? '',
                this.cardPlayed ? '' : ' from the game'
            ]
        });
    }

    private isValidTargetForTattoo(card: BaseCard, context: TriggeredAbilityContext) {
        return (
            card.type === CardType.Character &&
            card.controller === context.player &&
            card === (context.source as DrawCard).parent &&
            card.location === Location.PlayArea
        );
    }
}
