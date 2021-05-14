const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Elements } = require('../../Constants');

const elementKeys = [
    'third-tower-guard-earth',
    'third-tower-guard-water'
];

class ThirdTowerGuard extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                context.game.rings[this.getCurrentElementSymbol(elementKeys[0])].isConsideredClaimed(context.player) ||
                context.game.rings[this.getCurrentElementSymbol(elementKeys[1])].isConsideredClaimed(context.player)
            ),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys[0],
            prettyName: 'Claimed Ring',
            element: Elements.Earth
        });
        symbols.push({
            key: elementKeys[1],
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}

ThirdTowerGuard.id = 'third-tower-guard';

module.exports = ThirdTowerGuard;
