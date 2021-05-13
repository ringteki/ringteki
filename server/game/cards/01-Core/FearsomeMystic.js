const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class FearsomeMystic extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol('fearsome-mystic-air')),
            effect: AbilityDsl.effects.modifyGlory(2)
        });

        this.action({
            title: 'Remove fate from characters',
            condition: context => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.removeFate(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent).filter(card => card.getGlory() < context.source.getGlory())
            }))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'fearsome-mystic-air',
            prettyName: '+2 Glory',
            element: Elements.Air
        });
        return symbols;
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
