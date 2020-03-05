const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class Ninkatoshi extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => {
                return card.type === CardTypes.Province && card !== context.source && card.controller === context.player;
            },
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });
        this.persistentEffect({
            match: (card, context) => card.type === CardTypes.Province && card.controller === context.player.opponent,
            effect: AbilityDsl.effects.modifyProvinceStrength(-1)
        });
    }
}

Ninkatoshi.id = 'ninkatoshi';

module.exports = Ninkatoshi;
