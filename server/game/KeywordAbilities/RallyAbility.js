const TriggeredAbility = require('../triggeredability.js');
const { AbilityTypes, Locations } = require('../Constants');

class RallyAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, AbilityTypes.ForcedReaction, {
            when: {
                onCardRevealed: (event, context) => event.card === context.source &&
                    this.game.getProvinceArray().includes(event.card.location) &&
                    context.source.hasRally()
            },
            location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour],
            title: card.name + '\'s Rally',
            printedAbility: false,
            message: '{0} places {1} faceup in {2} due to {3}\'s Rally',
            messageArgs: context => [
                context.player,
                context.player.dynastyDeck.first() ? context.player.dynastyDeck.first() : 'a card',
                context.player.getProvinceCardInProvince(context.source.location).isFacedown() ? context.source.location : context.player.getProvinceCardInProvince(context.source.location),
                context.source
            ],
            handler: context => {
                context.player.triggerRally(context.source.location);
            }
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}

module.exports = RallyAbility;
