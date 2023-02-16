const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Phases, Players } = require('../../../Constants');

class ParanoidHososhi extends DrawCard {
    setupCardAbilities() {
        this.legendary(2);

        this.action({
            title: 'Steal fate from a character',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getCost() === this.getHighestCostOfCharactersInPlay(context),
                gameAction: AbilityDsl.actions.removeFate((context) => ({
                    amount: 1,
                    recipient: context.player
                }))
            },
            effect: 'take 1 fate from {0} — evil begone!'
        });
    }

    getHighestCostOfCharactersInPlay(context) {
        let charactersInPlay = context.game.findAnyCardsInPlay((c) => c.type === CardTypes.Character);
        return charactersInPlay.reduce((prevHighestCost, c) => {
            let cost = c.getCost();
            return typeof cost === 'number' && cost > prevHighestCost ? cost : prevHighestCost;
        }, 0);
    }
}

ParanoidHososhi.id = 'paranoid-hososhi';

module.exports = ParanoidHososhi;
