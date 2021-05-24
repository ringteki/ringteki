const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

const elementKey = 'along-the-river-of-gold-water';

class AlongTheRiverOfGold extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'switch a character\'s base skills',
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol(elementKey)),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && !card.hasDash(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Province Element',
            element: Elements.Water
        });
        return symbols;
    }
}

AlongTheRiverOfGold.id = 'along-the-river-of-gold';

module.exports = AlongTheRiverOfGold;
