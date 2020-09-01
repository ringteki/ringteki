const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players } = require('../../Constants');

class FoothillsKeep extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            condition: () => true,
            match: (card, context) => {
                return card.type === CardTypes.Province && card !== context.source && card.controller === context.player;
            },
            effect: AbilityDsl.effects.fateCostToRingToDeclareConflictAgainst()
        });
    }
}

FoothillsKeep.id = 'foothills-keep';

module.exports = FoothillsKeep;
