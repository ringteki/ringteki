const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { TargetModes } = require('../../../Constants.js');

class MantisRaider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.source.isParticipating(),
            target: {
                mode: TargetModes.Ring,
                ringCondition: ring => ring.fate > 0,
                gameAction: AbilityDsl.actions.takeFateFromRing(context => ({
                    target: context.ring,
                    amount: context.ring.fate
                }))
            }
        });
    }
}

MantisRaider.id = 'mantis-raider';

module.exports = MantisRaider;
