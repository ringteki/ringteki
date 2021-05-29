const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');
const GameModes = require('../../../GameModes.js');

class NobleSacrifice extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice honored character to discard dishonored one',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isHonored && (context.game.gameMode !== GameModes.Emerald || card.isParticipating())
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isDishonored && (context.game.gameMode !== GameModes.Emerald || card.isParticipating()),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}

NobleSacrifice.id = 'noble-sacrifice';

module.exports = NobleSacrifice;
