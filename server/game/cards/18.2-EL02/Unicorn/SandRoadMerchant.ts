import { Locations, PlayTypes, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');
import type Player = require('../../../player');

export default class SandRoadMerchant extends DrawCard {
    static id = 'sand-road-merchant';

    public setupCardAbilities() {
        this.reaction({
            title: "Look at your opponent's conflict deck",
            effect: "look at the top two cards of their opponent's conflict deck",
            when: {
                onConflictDeclared: (event, context) =>
                    event.attackers.includes(context.source) && context.player.opponent !== undefined,
                onDefendersDeclared: (event, context) =>
                    event.defenders.includes(context.source) && context.player.opponent !== undefined
            },
            gameAction: AbilityDsl.actions.sequentialContext((context) => ({
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
            }))
        });

        this.persistentEffect({
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card) => card.location === this.uuid,
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(
                    (player: Player) => player === this.controller,
                    PlayTypes.PlayFromHand
                ),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }
}
