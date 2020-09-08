const AbilityDsl = require('../../abilitydsl.js');
const StrongholdCard = require('../../strongholdcard.js');

class SevenFoldPalace extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 2 Honor',
            cost: ability.costs.bowSelf(),
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    context.player.isAttackingPlayer() &&
                    event.conflict.attackers.some(card => card.isHonored)
            },
            gameAction: AbilityDsl.actions.gainHonor(() => ({ amount: 2 }))
        });
    }
}

SevenFoldPalace.id = 'seven-fold-palace';

module.exports = SevenFoldPalace;
