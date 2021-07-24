const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations } = require('../../../Constants');

class ShinjoPathfinder extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking() && context.game.currentConflict.getConflictProvinces().some(a => a.facedown),
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}

ShinjoPathfinder.id = 'shinjo-pathfinder';
module.exports = ShinjoPathfinder;
