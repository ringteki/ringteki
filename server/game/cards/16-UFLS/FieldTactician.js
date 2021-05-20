const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FieldTactician extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Return a card to a deck',
            when: {
                onCardPlayed: (event, context) => event.card.hasTrait('tactic') && event.player === context.player
            },
            target: {
                activePromptTitle: 'Choose a conflict card',
                location: Locations.ConflictDiscardPile,
                cardType: [CardTypes.Character, CardTypes.Attachment, CardTypes.Event],
                controller: Players.Any,
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        const player = context.target.owner;
                        const orderedCards = player.conflictDeck.first(2);
                        orderedCards.push(context.target);
                        player.conflictDeck.splice(0, 2, ...orderedCards);
                    }
                })
            },
            effect: 'return {0} to {1}\'s conflict deck',
            effectArgs: context => [context.target.owner]
        });
    }
}

FieldTactician.id = 'field-tactician';

module.exports = FieldTactician;
