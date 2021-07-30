const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class EmpressRetainer extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home',
            anyPlayer: true,
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.discardImperialFavor(),
            gameAction: AbilityDsl.actions.sendHome()
        });
    }
}

EmpressRetainer.id = 'empress-s-retainer';
module.exports = EmpressRetainer;
