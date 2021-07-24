const DrawCard = require('../../../drawcard.js');
const { Durations, Players, Phases, ConflictTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class WarOfWords extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Both players may always declare political conflicts',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'allow each player to declare any conflict as political',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Any,
                effect: AbilityDsl.effects.provideConflictDeclarationType(ConflictTypes.Political)
            })
        });
    }
}

WarOfWords.id = 'war-of-words';

module.exports = WarOfWords;
