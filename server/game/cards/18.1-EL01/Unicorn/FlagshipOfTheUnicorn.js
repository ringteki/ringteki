const { CardTypes, Players, Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const ProvinceCard = require('../../../provincecard.js');

const elementKey = 'flagship-of-the-unicorn-water';

class FlagshipofTheUnicorn extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol(elementKey)),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.moveToConflict()
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

FlagshipofTheUnicorn.id = 'flagship-of-the-unicorn';

module.exports = FlagshipofTheUnicorn;