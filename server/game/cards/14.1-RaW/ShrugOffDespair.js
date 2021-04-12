const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class ShrugOffDespair extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to this province',
            conflictProvinceCondition: () => true,
            condition: context => context.game.currentConflict && !context.source.isConflictProvince(),
            gameAction: AbilityDsl.actions.moveConflict(context => ({
                target: context.source
            }))
        });
    }
}

ShrugOffDespair.id = 'shrug-off-despair';

module.exports = ShrugOffDespair;
