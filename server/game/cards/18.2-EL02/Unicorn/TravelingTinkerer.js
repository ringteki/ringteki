const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class TravelingTinkerer extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attachment to gain fate',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.hasTrait('merchant') && card.parent.isParticipating()
            }),
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}

TravelingTinkerer.id = 'traveling-tinkerer';

module.exports = TravelingTinkerer;
