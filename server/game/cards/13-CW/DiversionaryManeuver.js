const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class DiversionaryManeuver extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another province',
            effect: 'dishonor each participating non-courtier.',
            condition: context => context.game.isDuringConflict('military') && context.player.isAttackingPlayer(),
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.bow(context => ({
                    target: context.game.currentConflict.getParticipants()
                })),
                AbilityDsl.actions.sendHome(context => ({
                    target: context.game.currentConflict.getParticipants()
                }))
            ]) 
        });
    }
}

DiversionaryManeuver.id = 'diversionary-maneuver';

module.exports = DiversionaryManeuver;

