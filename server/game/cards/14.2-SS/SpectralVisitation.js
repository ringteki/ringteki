const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players, Durations } = require('../../Constants');

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
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: () => true
                }),
                AbilityDsl.actions.selectCard(context => ({
                    location: Locations.DynastyDiscardPile,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    targets: true,
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.putIntoPlay(),
                        AbilityDsl.actions.cardLastingEffect(context => ({
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onPhaseEnded: () => true
                                },
                                message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                                messageArgs: ['populate-target', context.source],
                                gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                            })
                        }))
                    ]),
                    message: '{0} puts {1} into play. {1} will be put on the bottom of the deck if it\'s still in play by the end of the phase',
                    messageArgs: card => [context.player, card, context.source]
                }))
            ])
        });
    }
}

SpectralVisitation.id = 'spectral-visitation';

module.exports = SpectralVisitation;
