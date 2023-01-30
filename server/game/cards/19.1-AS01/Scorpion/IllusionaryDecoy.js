const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Locations, Players } = require('../../../Constants.js');

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
            location: Locations.Hand,
            when: {
                onConflictStarted: () => true
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                activePromptTitle: 'Choose a character to move home',
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(context => ({
                        target: context.target
                    })),
                    AbilityDsl.actions.putIntoConflict(context => ({
                        target: context.source
                    }))
                ])
            }
        });

        this.action({
            title: 'Return to hand',
            condition: context => {
                const claimedRings = context.source.controller.getClaimedRings();
                const matchShugenjaElementWithClaimedRing = context.source.controller.cardsInPlay.any(card => {
                    return card.getType() === CardTypes.Character &&
                            card.hasTrait('shugenja') &&
                            claimedRings.some(ring => ring.getElements().some(element => card.hasTrait(element)));
                });
                return matchShugenjaElementWithClaimedRing;
            },
            gameAction: AbilityDsl.actions.returnToHand()
        });
    }
}

IllusionaryDecoy.id = 'illusionary-decoy';

module.exports = IllusionaryDecoy;
