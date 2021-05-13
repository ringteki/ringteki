const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class CourtNovice extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                context.game.rings[this.getCurrentElementSymbol('court-novice-air')].isConsideredClaimed(context.player) ||
                context.game.rings[this.getCurrentElementSymbol('court-novice-water')].isConsideredClaimed(context.player)
            ),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'court-novice-air',
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        symbols.push({
            key: 'court-novice-water',
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }
}

CourtNovice.id = 'court-novice';

module.exports = CourtNovice;
