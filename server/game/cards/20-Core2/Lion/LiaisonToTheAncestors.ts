import type AbilityContext from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Durations, Locations, Players, TargetModes } from '../../../Constants';
import type { Cost } from '../../../Costs';
import DrawCard from '../../../drawcard';
import type Player from '../../../player';

function hasMatchingTraitInPlay(traits: Set<string>, context: AbilityContext) {
    return (
        context.game.findAnyCardsInPlay((c: DrawCard) => {
            for (const candidateTrait of c.traits) {
                if (traits.has(candidateTrait)) {
                    return true;
                }
            }
            return false;
        }).length > 0
    );
}

function liaisonCost(): Cost {
    return {
        getActionName() {
            return 'liaisonToTheAncestorsCost';
        },
        getCostMessage() {
            return ['returning {0} to the bottom of the dynasty deck'];
        },
        canPay(context) {
            const discardPile: Array<DrawCard> = context.player.dynastyDiscardPile;
            if (!discardPile) {
                return false;
            }
            return discardPile.some((card) => hasMatchingTraitInPlay(card.getTraitSet(), context));
        },
        resolve(context, result) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a card to return to your deck',
                context: context,
                mode: TargetModes.Single,
                location: Locations.DynastyDiscardPile,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: DrawCard, context: AbilityContext) =>
                    hasMatchingTraitInPlay(card.getTraitSet(), context),
                onSelect: (_: Player, card: DrawCard) => {
                    context.costs.liaisonToTheAncestorsCost = card;
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent: function (context) {
            const action = context.game.actions.returnToDeck({
                target: context.costs.liaisonToTheAncestorsCost,
                bottom: true,
                location: Locations.DynastyDiscardPile
            });
            return action.getEvent(context.costs.liaisonToTheAncestorsCost, context);
        },
        promptsPlayer: true
    };
}

export default class LiaisonToTheAncestors extends DrawCard {
    static id = 'liaison-to-the-ancestors';

    setupCardAbilities() {
        this.action({
            title: 'Protect a character from dishonor',
            cost: liaisonCost(),
            cannotTargetFirst: true,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => {
                    const matchingTraits = (context.costs.liaisonToTheAncestorsCost as DrawCard).getTraitSet();
                    return card.traits.some((trait) => matchingTraits.has(trait));
                },
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
                })
            },
            effect: 'make {0} resistant to dishonor'
        });
    }
}
