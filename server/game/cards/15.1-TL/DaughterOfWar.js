const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Decks} = require('../../Constants');

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
            gameAction: AbilityDsl.actions.deckSearch(context => ({
                activePromptTitle: 'Choose a character to put into play ',
                deck: Decks.DynastyDeck,
                cardCondition: card => card.type === CardTypes.Character && card.costLessThan(context.source.parent.getCost()),
                reveal: true,
                faceup: true,
                destination: Locations.PlayArea
            }))
        });
    }
}
DaughterOfWar.id = 'daughter-of-war';

module.exports = DaughterOfWar;
