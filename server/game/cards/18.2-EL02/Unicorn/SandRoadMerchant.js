const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations, Players, PlayTypes } = require('../../../Constants');

class SandRoadMerchant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at your opponent\'s conflict deck',
            effect: 'look at the top two cards of their opponent\'s conflict deck',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source) && context.player.opponent,
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source) && context.player.opponent
            },
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                return ({
                    gameActions: [
                        AbilityDsl.actions.deckSearch(() => ({
                            amount: 2,
                            player: context.player.opponent,
                            choosingPlayer: context.player,
                            gameAction: AbilityDsl.actions.placeCardUnderneath({
                                destination: this
                            }),
                            shuffle: false,
                            reveal: true
                        })),
                        AbilityDsl.actions.chooseAction(() => {
                            let topCard = context.player.opponent.conflictDeck.first();
                            return {
                                activePromptTitle: topCard && 'Choose an action for ' + topCard.name,
                                player: Players.Opponent,
                                choices: {
                                    'Leave on top of your deck': AbilityDsl.actions.handler({ handler: () => {} }),
                                    'Put on the bottom of your deck': AbilityDsl.actions.handler({
                                        handler: () => {
                                            context.player.opponent.moveCard(topCard, Locations.ConflictDeck + ' bottom');
                                        }
                                    })
                                },
                                messages: {
                                    'Leave on top of your deck': '{0} chooses to put {2} on top of their deck',
                                    'Put on the bottom of your deck': '{0} chooses to put {2} on the bottom of their deck'
                                },
                                messageArgs: [topCard]
                            };
                        })
                    ]
                });
            })
            // gameAction: AbilityDsl.actions.deckSearch(context => ({
            //     amount: 2,
            //     player: context.player.opponent,
            //     choosingPlayer: context.player,
            //     gameAction: AbilityDsl.actions.placeCardUnderneath({
            //         destination: this
            //     }),
            //     shuffle: false,
            //     reveal: true,
            //     placeOnBottomInRandomOrder: true
            // }))
        });

        this.persistentEffect({
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: card => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(player => {
                    return player === this.controller;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }
}

SandRoadMerchant.id = 'sand-road-merchant';
module.exports = SandRoadMerchant;

