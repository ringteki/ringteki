const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class RelentlessGloryseeker extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.player.getClaimedRings().some(ring => ring.isConflictType('military')),
            gameAction: AbilityDsl.actions.ready(context => ({
                target: context.source
            }))
        });
    }
}

RelentlessGloryseeker.id = 'relentless-gloryseeker';

module.exports = RelentlessGloryseeker;
