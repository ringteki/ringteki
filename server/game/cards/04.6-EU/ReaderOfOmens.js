const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class ReaderOfOmens extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                this.game.rings[this.getCurrentElementSymbol('reader-of-omens-air')].isConsideredClaimed(context.player) ||
                this.game.rings[this.getCurrentElementSymbol('reader-of-omens-void')].isConsideredClaimed(context.player)
            ),
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'reader-of-omens-air',
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        symbols.push({
            key: 'reader-of-omens-void',
            prettyName: 'Claimed Ring',
            element: Elements.Void
        });
        return symbols;
    }
}

ReaderOfOmens.id = 'reader-of-omens';

module.exports = ReaderOfOmens;
