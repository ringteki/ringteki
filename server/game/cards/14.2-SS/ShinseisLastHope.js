const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, CharacterStatus, Locations, Players } = require('../../Constants');

class ShinseisLastHope extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                amount: 2,
                match: (card, source) => card.location === source.location
            })
        });

        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardTypes.Character && card.location === context.source.location,
            effect: AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Dishonored)
        });
    }
}

ShinseisLastHope.id = 'shinsei-s-last-hope';

module.exports = ShinseisLastHope;
