const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Durations, Players, ConflictTypes } = require('../../Constants');

class CunningNegotiator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Political duel to resolve the attacked province\'s action ability',
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                message: 'resolve the action ability of the attacked province',
                gameAction: duel => AbilityDsl.actions.resolveAbility(context => {
                    const conflictProvince = context.game.currentConflict.conflictProvince;
                    return {
                        player: duel.winner ? duel.winner.controller : context.source.controller,
                        target: duel.winner ? conflictProvince : [],
                        ability: duel.winner ? conflictProvince.abilities.actions[0] : [],
                        ignoredRequirements: ['limit']
                    };
                })
            }
        });
    }
}

CunningNegotiator.id = 'cunning-negotiator';

module.exports = CunningNegotiator;
