const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class OtterYakatabune extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw then discard a card',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw(context => ({
                    target: context.player,
                    amount: 1
                })),
                AbilityDsl.actions.chosenDiscard(context => ({
                    target: context.player,
                    amount: 1
                }))
            ]),
            effect: 'draw and then discard a card'
        });
    }
}

OtterYakatabune.id = 'otter-yakatabune';
module.exports = OtterYakatabune;
