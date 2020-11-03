const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations} = require('../../Constants');

class DaughterOfWar extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });
        this.interrupt({
            title: 'Put a character into play ',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.cardMenu(context => ({
                activePromptTitle: 'Choose a character to put into play ',
                cards: context.player.dynastyDeck.first(context.player.dynastyDeck.size()),
                cardCondition: card => card.type === CardTypes.Character && card.costLessThan(context.source.parent.getCost()),
                choices: ['Don\'t choose a character'],
                handlers: [
                    function() {
                        context.game.addMessage('{0} chooses not to put any character into play', context.player);
                        context.player.shuffleDynastyDeck();
                    }
                ],
                subActionProperties: card => ({ target: card }),
                message: '{0} chooses to put {1} into play',
                messageArgs: (card, player) => [player, card],
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.putIntoPlay(),
                    AbilityDsl.actions.shuffleDeck(context => ({
                        deck: Locations.DynastyDeck,
                        target: context.player
                    }))
                ])
            }))
        });
    }
}
DaughterOfWar.id = 'daughter-of-war';

module.exports = DaughterOfWar;
