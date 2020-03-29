const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants');

class SereneSeer extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at a province',
            condition: context => context.player.opponent && this.game.rings.void.isConsideredClaimed(context.player.opponent),
            effect: 'look at a province',
            gameAction: AbilityDsl.actions.selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            })
        });
    }
}

SereneSeer.id = 'serene-seer';

module.exports = SereneSeer;

