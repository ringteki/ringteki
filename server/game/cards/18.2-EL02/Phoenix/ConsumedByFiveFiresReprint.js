const DrawCard = require('../../../drawcard.js');
const { CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class ConsumedByFiveFiresReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Burn a character',
            condition: context => context.player.cardsInPlay.any(card => card.hasTrait('shugenja')),
            effect: 'burn {0}, removing 5 fate and preventing it from staying in play this round!',
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.removeFate({
                        amount: 2
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfRound,
                        effect: [
                            AbilityDsl.effects.cardCannot({
                                cannot: 'placeFate'
                            }),
                            AbilityDsl.effects.cardCannot({
                                cannot: 'preventedFromLeavingPlay'
                            }),
                        ]
                    })
                ])
            }
        });
    }
}

ConsumedByFiveFiresReprint.id = 'consumed-by-five-guys';

module.exports = ConsumedByFiveFiresReprint;
