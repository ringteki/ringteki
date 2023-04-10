const TriggeredAbility = require('../triggeredability.js');
const { AbilityTypes, Locations } = require('../Constants');
const { GameModes } = require('../../GameModes.js');

class RallyAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, AbilityTypes.KeywordReaction, {
            when: {
                onCardRevealed: (event, context) => event.card === context.source &&
                    context.game.getProvinceArray().includes(event.card.location) &&
                    context.source.hasRally()
            },
            location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour],
            title: card.name + '\'s Rally',
            printedAbility: false,
            message: game.gameMode !== GameModes.JadeEdict ?
                '{0} places {1} faceup in {2} due to {3}\'s Rally' :
                '{3}\'s Rally effect is suppressed due to the power of the Jade Edict!',
            messageArgs: context => [
                context.player,
                context.player.dynastyDeck.first() ? context.player.dynastyDeck.first() : 'a card',
                context.player.getProvinceCardInProvince(context.source.location).isFacedown() ? context.source.location : context.player.getProvinceCardInProvince(context.source.location),
                context.source
            ],
            handler: context => {
                if(context.game.gameMode !== GameModes.JadeEdict) {
                    context.player.putTopDynastyCardInProvince(context.source.location);
                }
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
