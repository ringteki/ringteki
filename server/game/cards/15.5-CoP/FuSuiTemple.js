const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class FuSuiTemple extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            match: (card, context) => card.isParticipating() && context.game.isDuringConflict('political'),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}

FuSuiTemple.id = 'fu-sui-temple';

module.exports = FuSuiTemple;
