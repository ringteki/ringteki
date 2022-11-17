const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Phases, Players } = require('../../../Constants');

class ParanoidHososhi extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.immunity({ restricts: 'events' })
        });

        this.action({
            title: 'Steal fate from a character',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.getCost() ===
                    this.getHighestCostOfCharactersInPlay(context),
                gameAction: AbilityDsl.actions.removeFate((context) => ({
                    amount: 1,
                    recipient: context.player
                }))
            },
            effect: 'take 1 fate from {0} — evil begone!'
        });
    }

    getHighestCostOfCharactersInPlay(context) {
        let charactersInPlay = context.game.findAnyCardsInPlay(
            (c) => c.type === CardTypes.Character
        );
        let characterCosts = charactersInPlay.map((c) => {
            let cost = c.getCost();
            return typeof cost === 'number' && !isNaN(cost) ? cost : 0;
        });

        return Math.max(...characterCosts);
    }
}

ParanoidHososhi.id = 'paranoid-hososhi';

module.exports = ParanoidHososhi;
