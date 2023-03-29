const DrawCard = require('../../../drawcard.js');
const { EventNames, CardTypes, AbilityTypes, Locations, Players } = require('../../../Constants');
const EventRegistrar = require('../../../eventregistrar.js');
const AbilityDsl = require('../../../abilitydsl');

class StormFromSakkaku extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            {
                [EventNames.OnResolveRingElement + ':' + AbilityTypes.WouldInterrupt]: 'cancelRingEffect'
            }
        ]);

        this.action({
            title: 'Move holding to another province',
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.location !== context.source.location && card.location !== Locations.StrongholdProvince
            },
            gameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: context.target.location
            })),
            then: {
                gameAction: AbilityDsl.actions.discardCard((context) => ({
                    target: this.otherHoldingsInSameProvince(context)
                })),
                message: 'The {1} {3}',
                messageArgs: (context) => [
                    this.otherHoldingsInSameProvince(context).length > 0
                        ? 'is angry and discards the holdings that they find in the province'
                        : 'calms down'
                ]
            }
        });
    }

    otherHoldingsInSameProvince(context) {
        return context.game.allCards.filter(
            (card) =>
                card.location === context.source.location &&
                card.type === CardTypes.Holding &&
                !card.facedown &&
                card !== context.source
        );
    }

    cancelRingEffect(event) {
        if(event.context.game.currentConflict && this.isInConflictProvince() && !event.cancelled) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}

StormFromSakkaku.id = 'storm-from-sakkaku';

module.exports = StormFromSakkaku;
