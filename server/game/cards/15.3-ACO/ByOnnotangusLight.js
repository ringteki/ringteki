const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Locations, Players } = require('../../Constants');

class ByOnnotangusLight extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Any,
            targetLocation: Locations.PlayArea,
            match: card => card.type === CardTypes.Character,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'removeFate'
                }),
                AbilityDsl.effects.setApparentFate(0)
            ]
        });
    }
}

ByOnnotangusLight.id = 'by-onnotangu-s-light';

module.exports = ByOnnotangusLight;
