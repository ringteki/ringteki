const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players } = require('../../Constants');

class UnbridledAmbition extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            targetController: Players.Any,
            effect: AbilityDsl.effects.cannotContribute(() => {
                return card => card.isDishonored;
            })
        });
    }
}

UnbridledAmbition.id = 'unbridled-ambition';

module.exports = UnbridledAmbition;
