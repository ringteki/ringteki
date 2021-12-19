const DrawCard = require('../../../drawcard.js');
const { CardTypes, Durations, Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class ConsumedByFiveFiresReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Burn a character',
            phase: Phases.Conflict,
            condition: context => !context.game.isDuringConflict(),
            effect: 'burn {0}, discarding all attachments and fate from it and preventing it from staying in play this round!',
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.discardFromPlay(context => ({
                        target: context.target.attachments.toArray()
                    })),
                    AbilityDsl.actions.removeFate(context => ({
                        amount: context.target.getFate(),
                    })),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfRound,
                        effect: [
                            AbilityDsl.effects.cardCannot({
                                cannot: 'placeFate'
                            }),
                            AbilityDsl.effects.cardCannot({
                                cannot: 'preventedFromLeavingPlay'
                            })
                        ]
                    })
                ])
            }
        });
    }
}

ConsumedByFiveFiresReprint.id = 'consumed-by-five-guys';

module.exports = ConsumedByFiveFiresReprint;
