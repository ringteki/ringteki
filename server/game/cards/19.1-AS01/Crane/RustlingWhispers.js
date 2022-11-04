const DrawCard = require('../../../drawcard.js');
const { EventNames, CardTypes, AbilityTypes } = require('../../../Constants');
const EventRegistrar = require('../../../eventregistrar.js');
const AbilityDsl = require('../../../abilitydsl');

class RustlingWhispers extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            {
                [EventNames.OnResolveRingElement +
                ':' +
                AbilityTypes.WouldInterrupt]: 'cancelRingEffect'
            }
        ]);

        this.action({
            title: 'Fill the province with a card',
            effect: 'refill their province{1}{2}',
            effectArgs: (context) => {
                let topCard = context.player.dynastyDeck.first();
                return [
                    topCard.type === CardTypes.Holding
                        ? ' — but the spirits are angry and destroy '
                        : topCard.type === CardTypes.Character
                            ? ' — the spirits are calm, and let them find '
                            : ' — the spirits are silent, and bring ',
                    topCard
                ];
            },
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.conditional((context) => {
                let topCard = context.player.dynastyDeck.first();
                return {
                    condition: topCard.type === CardTypes.Holding,
                    trueGameAction: AbilityDsl.actions.discardCard({
                        target: topCard
                    }),
                    falseGameAction: AbilityDsl.actions.moveCard({
                        target: topCard,
                        destination: this.location,
                        faceup: true
                    })
                };
            })
        });
    }

    cancelRingEffect(event) {
        if(
            event.context.game.currentConflict &&
            this.isInConflictProvince() &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}

RustlingWhispers.id = 'rustling-whispers';

module.exports = RustlingWhispers;
