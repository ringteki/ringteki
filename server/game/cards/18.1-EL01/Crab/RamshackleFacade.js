const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class RamshackleFacade extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card.getMilitarySkill() <= context.player.getNumberOfHoldingsInPlay(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

RamshackleFacade.id = 'ramshackle-facade';

module.exports = RamshackleFacade;
