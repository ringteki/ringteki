const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class ShrugOffDespair extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to this province',
            condition: context => context.game.currentConflict && context.game.currentConflict.conflictProvince !== context.source,
            gameAction: AbilityDsl.actions.moveConflict(context => ({
                target: context.source
            }))
        });
    }
}

ShrugOffDespair.id = 'shrug-off-despair';

module.exports = ShrugOffDespair;
