const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, CharacterStatus, Locations, Players } = require('../../Constants');

class Tsuma extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardTypes.Character && card.location === context.source.location,
            effect: AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Honored)
        });
    }
}

Tsuma.id = 'tsuma';

module.exports = Tsuma;
