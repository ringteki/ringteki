const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players } = require('../../Constants');

class TheScorpionClanCoup extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.isDefendingPlayer() && context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('imperial')),
            targetController: Players.Opponent,
            match: (card) => card.isAttacking(),
            effect: AbilityDsl.effects.modifyBothSkills(-1)
        });
    }
}

TheScorpionClanCoup.id = 'the-scorpion-clan-coup';

module.exports = TheScorpionClanCoup;
