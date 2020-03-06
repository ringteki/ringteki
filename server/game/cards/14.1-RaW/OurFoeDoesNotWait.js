const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class OurFoeDoesNotWait extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place a card from your deck faceup on a province',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player

            },
            effect: 'look at the top eight cards of their dynasty deck',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken
            },
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place in a province',
                context: context,
                cards: context.player.dynastyDeck.first(8),
                cardHandler: cardFromDeck => {
                    let provinceLocation = context.target.location;
                    context.player.moveCard(cardFromDeck, provinceLocation);
                    cardFromDeck.facedown = false;
                    this.game.addMessage('{0} puts {1} into {2}', context.player, cardFromDeck.name, context.target.facedown ? 'a facedown province' : context.target.name);
                }
            })
        });
    }
}

OurFoeDoesNotWait.id = 'our-foe-does-not-wait';

module.exports = OurFoeDoesNotWait;
