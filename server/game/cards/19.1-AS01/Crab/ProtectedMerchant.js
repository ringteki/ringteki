const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class ProtectedMerchant extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyGlory(() => Math.min(2, this.getHoldingsInPlay()))
        });
    }

    getHoldingsInPlay() {
        return this.game.allCards.reduce(
            (sum, card) =>
                card.type === CardTypes.Holding &&
                card.controller === this.controller &&
                card.isFaceup() &&
                card.isInProvince()
                    ? sum + 1
                    : sum,
            0
        );
    }
}

ProtectedMerchant.id = 'protected-merchant';

module.exports = ProtectedMerchant;
