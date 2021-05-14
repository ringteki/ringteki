const DrawCard = require('../../drawcard.js');
const { Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ReclusiveZokujin extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol('reclusive-zokujin-earth')),
            effect: [
                AbilityDsl.effects.addKeyword('covert'),
                AbilityDsl.effects.immunity({
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'reclusive-zokujin-earth',
            prettyName: 'Conflict Type',
            element: Elements.Earth
        });
        return symbols;
    }
}

ReclusiveZokujin.id = 'reclusive-zokujin';

module.exports = ReclusiveZokujin;
