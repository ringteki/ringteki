const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class SadaneStudent extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                this.game.rings[this.getCurrentElementSymbol('sadane-student-air')].isConsideredClaimed(context.player) ||
                this.game.rings[this.getCurrentElementSymbol('sadane-student-fire')].isConsideredClaimed(context.player)
            ),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'sadane-student-air',
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        symbols.push({
            key: 'sadane-student-fire',
            prettyName: 'Claimed Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}

SadaneStudent.id = 'sadane-student';

module.exports = SadaneStudent;
