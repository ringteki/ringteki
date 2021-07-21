const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class RamshackleFacade extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Holding
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.getCurrentMilitary() <= context.costs.sacrificeStateWhenChosen.getProvinceStrengthBonus(),
                gameAction: AbilityDsl.actions.bow()
            },
        });
    }
}

RamshackleFacade.id = 'ramshackle-facade';

module.exports = RamshackleFacade;
