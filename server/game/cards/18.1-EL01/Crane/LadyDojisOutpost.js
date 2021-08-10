const StrongholdCard = require('../../../strongholdcard.js');
const { Players, Phases, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class LadyDojisOutpost extends StrongholdCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(),
            match: (card, context) => card.isParticipatingFor(context.player) && context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Gain fate',
            phase: Phases.Conflict,
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.dishonor({ cardCondition: card => card.type === CardTypes.Character })
            ],
            gameAction: AbilityDsl.actions.gainFate(context => ({
                target: context.player,
                amount: 2
            }))
        });

    }
}

LadyDojisOutpost.id = 'lady-doji-s-outpost';

module.exports = LadyDojisOutpost;
