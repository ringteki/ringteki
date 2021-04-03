const DrawCard = require('../../drawcard.js');
const { DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ArrogantKakita extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Initiate a political duel',
            when: {
                onDefendersDeclared: (event, context) => context.source.isParticipating()
            },
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.sendHome(context => ({
                    target: duel.loser === context.source ? context.source : []
                }))
            },
            limit: AbilityDsl.limit.perRound(99)
        });
    }
}

ArrogantKakita.id = 'arrogant-kakita';

module.exports = ArrogantKakita;
