const StrongholdCard = require('../../strongholdcard.js');
const { Durations, Players, ConflictTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CastleOfTheForgotten extends StrongholdCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Make all conflicts military',
            cost: AbilityDsl.costs.bowSelf(),
            when: {
                onBreakProvince: (event, context) => event.card.owner !== context.player
            },
            gameAction: AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: AbilityDsl.effects.setConflictDeclarationType(ConflictTypes.Military),
                duration: Durations.UntilEndOfPhase
            }),
            effect: 'make all future conflicts {1} for this phase',
            effectArgs: ['military']
        });
    }
}

CastleOfTheForgotten.id = 'castle-of-the-forgotten';

module.exports = CastleOfTheForgotten;
