const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Locations } = require('../../../Constants.js');

class IllusionaryDecoy extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => !context.source.controller.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja')),
                message: '{0} is discarded from play as {1} does not control a shugenja',
                messageArgs: context => [context.source, context.source.controller],
                gameAction: AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.source
                }))
            })
        });

        this.reaction({
            title: 'Put into play',
            location: [Locations.Hand, Locations.ConflictDiscardPile],
            when: {
                onDefendersDeclared: () => true
            },
            gameAction: AbilityDsl.actions.putIntoPlay()
        });

        this.action({
            title: 'Return to hand',
            condition: context => context.source.isParticipating() && context.source.controller.cardsInPlay.any(card => {
                return card.getType() === CardTypes.Character &&
                        card.hasTrait('shugenja') &&
                        context.game.currentConflict.elements.some(element => card.hasTrait(element));
            }),
            gameAction: AbilityDsl.actions.returnToHand()
        });
    }
}

IllusionaryDecoy.id = 'illusionary-decoy';

module.exports = IllusionaryDecoy;
