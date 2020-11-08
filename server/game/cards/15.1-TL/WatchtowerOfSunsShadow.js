const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players } = require('../../Constants');

class WatchtowerOfSunsShadow extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => {
                if(context.game.currentConflict && context.game.currentConflict.conflictProvince && context.player.isDefendingPlayer()) {
                    let cards = context.player.getDynastyCardsInProvince(context.game.currentConflict.conflictProvince.location);
                    return cards.some(card => card.isFaceup() && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'));
                }
                return false;
            },
            targetController: Players.Opponent,
            match: (card) => card.isAttacking(),
            effect: AbilityDsl.effects.modifyBothSkills(card => -card.getFate())
        });

        this.forcedInterrupt({
            title: 'Lose 2 honor',
            when: {
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            },
            gameAction: AbilityDsl.actions.loseHonor(context => ({
                amount: 2,
                target: context.player
            }))
        });
    }
}

WatchtowerOfSunsShadow.id = 'watchtower-of-sun-s-shadow';

module.exports = WatchtowerOfSunsShadow;
