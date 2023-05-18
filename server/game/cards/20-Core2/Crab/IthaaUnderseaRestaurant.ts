import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class IthaaUnderseaRestaurant extends ProvinceCard {
    static id = 'ithaa-undersea-restaurant';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.changePlayerGloryModifier(2)
        });
    }
}
