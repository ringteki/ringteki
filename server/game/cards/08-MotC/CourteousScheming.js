const DrawCard = require('../../drawcard.js');
const { Durations, DuelTypes } = require('../../Constants');

class CourteousScheming extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a political duel',
            condition: () =>
                this.game.currentConflict &&
                this.game.currentConflict.conflictType === 'political',
            initiateDuel: () => ({
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                gameAction: duel =>
                    duel.winner &&
                    ability.actions.playerLastingEffect({
                        targetController: duel.winner.controller,
                        duration: Durations.UntilEndOfPhase,
                        effect: ability.effects.additionalConflict('political')
                    })
            }),
            max: ability.limit.perRound(1)
        });
    }
}

CourteousScheming.id = 'courteous-scheming';
module.exports = CourteousScheming;
