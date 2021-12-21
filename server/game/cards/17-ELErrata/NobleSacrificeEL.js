const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class NobleSacrificeEL extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice honored character to discard dishonored one',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: card => card.isHonored && card.isParticipating()
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isDishonored && card.isParticipating(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}

NobleSacrificeEL.id = 'noble-sacrifice-el';

module.exports = NobleSacrificeEL;
