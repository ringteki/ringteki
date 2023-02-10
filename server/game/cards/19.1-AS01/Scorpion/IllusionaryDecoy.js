const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Locations, Players } = require('../../../Constants.js');

class IllusionaryDecoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put into play',
            location: Locations.Hand,
            when: {
                onConflictStarted: (event, context) =>
                    context.player.anyCardsInPlay((card) => card.hasTrait('shugenja'))
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.putIntoConflict((context) => ({
                    target: context.source
                })),
                AbilityDsl.actions.chooseAction((context) => {
                    let moveChoice = 'Move another of your characters home';
                    let stayChoice = 'Done';
                    return {
                        messages: {
                            [moveChoice]: '', // Don't want messages here
                            [stayChoice]: '' // Don't want messages here
                        },
                        choices: {
                            [moveChoice]: AbilityDsl.actions.selectCard({
                                controller: Players.Self,
                                cardType: CardTypes.Character,
                                cardCondition: (card) => card.isParticipating(),
                                message: '{0} moves home {1} - they were an {2}!',
                                messageArgs: (card, player) => [player, card, context.source],
                                gameAction: AbilityDsl.actions.sendHome()
                            }),
                            [stayChoice]: AbilityDsl.actions.noAction()
                        }
                    };
                })
            ]),
            effect: 'put {0} into play in the conflict'
        });

        this.action({
            title: 'Return to hand',
            condition: (context) => {
                const claimedRings = context.source.controller.getClaimedRings();
                const matchShugenjaElementWithClaimedRing = context.source.controller.cardsInPlay.any((card) => {
                    return (
                        card.getType() === CardTypes.Character &&
                        card.hasTrait('shugenja') &&
                        claimedRings.some((ring) => ring.getElements().some((element) => card.hasTrait(element)))
                    );
                });
                return matchShugenjaElementWithClaimedRing;
            },
            gameAction: AbilityDsl.actions.returnToHand()
        });
    }
}

IllusionaryDecoy.id = 'illusionary-decoy';

module.exports = IllusionaryDecoy;
