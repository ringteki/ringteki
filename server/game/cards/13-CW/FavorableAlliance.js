const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class FavorableAlliance extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            cost: AbilityDsl.costs.variableFateCost({
                minAmount: 1,
                maxAmount: (context) => context.player.conflictDeck.size(),
                activePromptTitle: 'Choose a value for X'
            }),
            effect: 'draw {1} cards',
            effectArgs: context => context.costs.variableFateCost,
            gameAction: AbilityDsl.actions.draw(context => ({ amount: context.costs.variableFateCost }))
        });
    }
}

FavorableAlliance.id = 'favorable-alliance';

module.exports = FavorableAlliance;
