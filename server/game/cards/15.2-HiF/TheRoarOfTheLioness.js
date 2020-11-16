const ProvinceCard = require('../../provincecard.js');

class TheRoarOfTheLioness extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            effect: ability.effects.modifyBaseProvinceStrength(card => Math.round(card.controller.honor / 2))
        });
    }
}

TheRoarOfTheLioness.id = 'the-roar-of-the-lioness';

module.exports = TheRoarOfTheLioness;
