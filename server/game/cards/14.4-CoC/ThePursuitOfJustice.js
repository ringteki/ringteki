const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

const elementKey = 'the-pursuit-of-justice-water';

class ThePursuitOfJustice extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol(elementKey)),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Elements.Water
        });
        return symbols;
    }
}

ThePursuitOfJustice.id = 'the-pursuit-of-justice';

module.exports = ThePursuitOfJustice;
