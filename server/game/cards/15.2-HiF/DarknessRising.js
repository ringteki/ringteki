const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class DarknessRising extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow weaker military characters',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.dishonor({ cardCondition: card => card.isParticipating() }),
            cannotTargetFirst: true,
            gameAction: AbilityDsl.actions.bow(context => ({
                target: context.game.currentConflict.getParticipants(participant => participant !== context.costs.dishonor
                    && participant.getMilitarySkill() < context.costs.dishonor.getMilitarySkill())
            }))
        });
    }

    isTemptationsMaho() {
        return true;
    }
}

DarknessRising.id = 'darkness-rising';

module.exports = DarknessRising;
