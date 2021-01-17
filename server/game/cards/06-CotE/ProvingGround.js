const DrawCard = require('../../drawcard.js');

class ProvingGround extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card after winning a duel',
            when: {
                afterDuel: (event, context) => {
                    if(!event.winner) {
                        return false;
                    }
                    return event.winningPlayer === context.player;
                }
            },
            gameAction: ability.actions.draw(),
            limit: ability.limit.perRound(2)
        });
    }
}

ProvingGround.id = 'proving-ground';

module.exports = ProvingGround;
