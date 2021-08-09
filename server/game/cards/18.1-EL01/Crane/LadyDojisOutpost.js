const StrongholdCard = require('../../../strongholdcard.js');
const { Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class LadyDojisOutpost extends StrongholdCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict('political'),
            match: card => card.hasTrait('courtier') && !card.isDishonored,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(1)
        });
    }
}

LadyDojisOutpost.id = 'lady-doji-s-outpost';

module.exports = LadyDojisOutpost;