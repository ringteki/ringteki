const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class SeekerOfKnowledge extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.addElementAsAttacker(this.getCurrentElementSymbol('seeker-of-knowledge-air'))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'seeker-of-knowledge-air',
            prettyName: 'Add Element',
            element: Elements.Air
        });
        return symbols;
    }
}

SeekerOfKnowledge.id = 'seeker-of-knowledge';

module.exports = SeekerOfKnowledge;
