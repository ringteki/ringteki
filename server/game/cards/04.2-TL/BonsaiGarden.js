const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class BonsaiGarden extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 1 honor',
            condition: context => context.game.isDuringConflict(this.getCurrentElementSymbol('bonsai-garden-air')),
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'bonsai-garden-air',
            prettyName: 'Conflict Ring',
            element: Elements.Air
        });
        return symbols;
    }
}

BonsaiGarden.id = 'bonsai-garden';

module.exports = BonsaiGarden;
