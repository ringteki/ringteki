const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players, Locations, Decks } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class TheEmpressLegacy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for a character card',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: card => !card.isBroken && !card.isFacedown() && card.location !== Locations.StrongholdProvince,
                gameAction: AbilityDsl.actions.deckSearch({
                    activePromptTitle: 'Choose a character',
                    deck: Decks.DynastyDeck,
                    cardCondition: card => card.type === CardTypes.Character && card.isUnique(),
                    shuffle: true,
                    message: '{0} puts {1} facedown into {2}',
                    messageArgs: (context, cards) => [context.player, cards, context.target.name],
                    gameAction: AbilityDsl.actions.moveCard(context => ({
                        destination: context.target.location,
                        faceup: false
                    }))
                })
            },
            effect: 'choose a character to place in a province'
        });
    }
}

TheEmpressLegacy.id = 'the-empress-s-legacy';

module.exports = TheEmpressLegacy;


