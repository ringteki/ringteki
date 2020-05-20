const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players, Durations } = require('../../Constants');

class SpectralVisitation extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'put a character from your discard pile into play',
            cannotTargetFirst: true,
            when: {
                onCardRevealed: (event, context) => context.source === event.card
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.dynastyDeck.first(4),
                    destination: Locations.DynastyDiscardPile
                })),
                AbilityDsl.actions.selectCard(context => ({
                    location: Locations.DynastyDiscardPile,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.putIntoPlay(),
                        AbilityDsl.actions.cardLastingEffect(context => ({
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onPhaseEnded: () => true
                                },
                                message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                                messageArgs: [this, context.source],
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
