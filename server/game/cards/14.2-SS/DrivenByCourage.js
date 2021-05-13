const ProvinceCard = require('../../provincecard.js');
const { Players, CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class DrivenByCourage extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'give target character +2/+2',
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol('driven-by-courage-air')),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyBothSkills(2)
                }))
            },
            effect: 'give {0} +2{1} and +2{2}',
            effectArgs: () => ['political', 'military']
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'driven-by-courage-air',
            prettyName: 'Province Type',
            element: Elements.Air
        });
        return symbols;
    }
}

DrivenByCourage.id = 'driven-by-courage';

module.exports = DrivenByCourage;
