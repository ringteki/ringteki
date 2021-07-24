const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations } = require('../../../Constants');

class MotoRaiju extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => card.controller.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince))
        });
    }
}

MotoRaiju.id = 'moto-raiju';
module.exports = MotoRaiju;
