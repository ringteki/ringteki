const DrawCard = require('../../../drawcard.js');
const { TargetModes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class MantisRaider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain all fate from a ring',
            condition: context => context.game.isDuringConflict(),
            target: {
                mode: TargetModes.Ring,
                ringCondition: ring => ring.fate !== 0,
                activePromptTitle: 'Choose a ring to gain all fate from',
                gameAction: AbilityDsl.actions.takeFateFromRing()
            }
        });
    }
}

MantisRaider.id = 'mantis-raider';

module.exports = MantisRaider;
