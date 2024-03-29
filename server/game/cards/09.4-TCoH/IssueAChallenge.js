const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Durations } = require('../../Constants.js');

class IssueAChallenge extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent more than 1 declared defender',
            when: {
                onConflictDeclared: (event, context) =>
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 &&
                    context.game.currentConflict.getParticipants(
                        (participant) => participant.hasTrait('bushi') && participant.controller === context.player
                    ).length === 1 &&
                    context.player === context.game.currentConflict.attackingPlayer
            },
            effect: 'prevent {1} from declaring more than 1 defender.',
            effectArgs: (context) => context.player.opponent,
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.restrictNumberOfDefenders(1),
                duration: Durations.UntilEndOfConflict
            }))
        });
    }
}

IssueAChallenge.id = 'issue-a-challenge';

module.exports = IssueAChallenge;
