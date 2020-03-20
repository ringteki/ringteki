const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players, Durations, Phases } = require('../../Constants');

class SpectralVisitation extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'put a character from your discard pile into play',
            when: {
                onCardRevealed: (event, context) => context.source === event.card
            },
            cost: AbilityDsl.costs.discardCard(context => ({
                target: context.player.dynastyDeck.first(4)
            })),
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
