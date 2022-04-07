const DrawCard = require('../../../drawcard.js');
const { Locations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class DragonflyMediator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Have each player reveal a card',
            targets: {
                myCard: {
                    activePromptTitle: 'Choose a card to reveal',
                    location: Locations.Hand,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
                },
                oppCard: {
                    activePromptTitle: 'Choose a card to reveal',
                    player: Players.Opponent,
                    location: Locations.Hand,
                    controller: Players.Opponent,
                    gameAction: AbilityDsl.actions.reveal(context => ({ chatMessage: true, player: context.player.opponent }))
                }
            },
            effect: 'have each player reveal a card from their hand'
        });
    }
}

DragonflyMediator.id = 'dragonfly-mediator';
module.exports = DragonflyMediator;
