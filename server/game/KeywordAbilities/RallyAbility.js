const TriggeredAbility = require('../triggeredability.js');
const { AbilityTypes, Locations } = require('../Constants');

class RallyAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, AbilityTypes.ForcedReaction, {
            when: {
                onCardRevealed: (event, context) => event.card === context.source &&
                    [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(event.card.location) &&
                    context.source.hasRally()
            },
            location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour],
            title: card.name + '\'s Rally',
            printedAbility: false,
            message: '{0} places {1} faceup in {2} due to {3}\'s Rally',
            messageArgs: context => [
                context.player, 
                context.player.dynastyDeck.first(), 
                context.player.getProvinceCardInProvince(context.source.location).facedown ? context.source.location : context.player.getProvinceCardInProvince(context.source.location),
                context.source
            ],
            handler: context => {
                let cardFromDeck = context.player.dynastyDeck.first();
                context.player.moveCard(cardFromDeck, context.source.location);
                cardFromDeck.facedown = false;
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
