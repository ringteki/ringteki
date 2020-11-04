const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, Locations, Decks } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class UnyieldingSensei extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a province',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: (card, context) => !card.isBroken && context.player.getDynastyCardsInProvince(card.location).some(c => c.getType() === CardTypes.Holding && c.isFaceup())
            },
            effect: 'look at the top two cards of their dynasty deck',
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character',
                amount: 2,
                deck: Decks.DynastyDeck,
                cardCondition: card => card.type === CardTypes.Character,
                shuffle: false,
                message: '{0} puts {1} into {2}',
                messageArgs: (context, cards) => [context.player, cards, context.target.isFacedown() ? 'a facedown province' : context.target.name],
                gameAction: AbilityDsl.actions.moveCard(context => ({
                    destination: context.target.location
                }))
            })
            // handler: context => this.game.promptWithHandlerMenu(context.player, {
            //     activePromptTitle: 'Choose a character',
            //     context: context,
            //     cardCondition: card => card.getType() === CardTypes.Character,
            //     cards: context.player.dynastyDeck.first(2),
            //     choices: ['Take nothing'],
            //     handlers: [() => {
            //         this.game.addMessage('{0} takes nothing', context.player);
            //         return true;
            //     }],
            //     cardHandler: cardFromDeck => {
            //         let provinceLocation = context.target.location;
            //         context.player.moveCard(cardFromDeck, provinceLocation);
            //         cardFromDeck.facedown = false;
            //         this.game.addMessage('{0} puts {1} into {2}', context.player, cardFromDeck.name, context.target.isFacedown() ? 'a facedown province' : context.target.name);
            //     }
            // })
        });
    }
}

UnyieldingSensei.id = 'unyielding-sensei';

module.exports = UnyieldingSensei;

