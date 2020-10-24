const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players } = require('../../Constants');

class WatchtowerOfSunsShadow extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => {
                if(context.player.isDefendingPlayer()) {
                    let cards = context.player.getDynastyCardsInProvince(this.game.currentConflict.conflictProvince.location);
                    return cards.some(card => card.isFaceup() && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'));
                }
                return false;
            },
            targetController: Players.Opponent,
            match: (card, context) => card.controller === context.player.opponent,
            effect: AbilityDsl.effects.modifyBothSkills(card => -card.fate)
        });
    }
}

WatchtowerOfSunsShadow.id = 'watchtower-of-sun-s-shadow';

module.exports = WatchtowerOfSunsShadow;
