const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ThePursuitOfJustice extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            conflictProvinceCondition: province => province.isElement(Elements.Water),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

ThePursuitOfJustice.id = 'the-pursuit-of-justice';

module.exports = ThePursuitOfJustice;
