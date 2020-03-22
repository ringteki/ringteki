const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const _ = require('underscore');
const { CardTypes, Locations, Players, Durations, Phases } = require('../../Constants');

const spectralVisitationCost = () => ({
    action: { name: 'spectralVisitationCost', getCostMessage: () => ['discard the top 4 dynasty cards', []] },
    canPay: function (context) {
        return context.player.dynastyDeck.size() >= 4;
    },
    resolve: function(context) {
        context.costs.spectralVisitationCost = context.player.dynastyDeck.first(4);
    },
    pay: function(context) {
        const discardedCards = context.costs.spectralVisitationCost;
        discardedCards.slice(0, 4).forEach(card => {
            card.controller.moveCard(card, Locations.DynastyDiscardPile);
        });
    }
});


class SpectralVisitation extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'put a character from your discard pile into play',
            cannotTargetFirst: true,
            when: {
                onCardRevealed: (event, context) => context.source === event.card
            },
            cost: [spectralVisitationCost()],
            target: {
                location: Locations.DynastyDiscardPile,
                cardType: CardTypes.Character,
                controller: Players.Self
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.putIntoPlay(context => ({
                    target: context.target
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.target,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onPhaseEnded: (event) => event.phase === Phases.Conflict
                        },
                        message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                        messageArgs: [context.target, context.source],
                        gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                    })
                }))
            ]),
            effect: 'put {1} into play. {1} will be put on the bottom of the deck if it\'s still in play by the end of the phase',
            effectArgs: context => [context.target]
        });
    }
}

SpectralVisitation.id = 'spectral-visitation';

module.exports = SpectralVisitation;
