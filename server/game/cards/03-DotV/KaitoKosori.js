const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class KaitoKosori extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context =>
                context.player.cardsInPlay.any(card => card.isParticipating()) &&
                this.game.currentConflict.hasElement(this.getCurrentElementSymbol('kaito-kosori-air')) && !context.source.isParticipating(),
            effect: AbilityDsl.effects.contributeToConflict((card, context) => context.player)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'kaito-kosori-air',
            prettyName: 'Conflict Type',
            element: Elements.Air
        });
        return symbols;
    }

}

KaitoKosori.id = 'kaito-kosori';

module.exports = KaitoKosori;
