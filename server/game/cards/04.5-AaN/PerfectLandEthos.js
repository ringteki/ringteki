const DrawCard = require('../../drawcard.js');

class PerfectLandEthos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: ability.actions.discardStatusToken(context => ({
                target: context.game.findAnyCardsInAnyList(card => card.isHonored || card.isDishonored || card.isTainted).map(card => card.statusTokens[0])
            }))
        });
    }
}

PerfectLandEthos.id = 'perfect-land-ethos';

module.exports = PerfectLandEthos;
