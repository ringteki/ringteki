const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Players } = require('../../Constants');

class CunningNegotiator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Political duel to resolve the attacked province\'s action ability',
            condition: context => context.game.currentConflict && context.game.currentConflict.conflictProvince,
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                message: 'resolve the action ability of the attacked province',
                gameAction: duel => AbilityDsl.actions.menuPrompt(context => ({
                    activePromptTitle: 'Do you want to trigger ' + context.game.currentConflict.conflictProvince.name + '?',
                    choices: duel.winner ? ['Yes', 'No'] : [],
                    player: (duel.winner && duel.winner.controller === context.player) ? Players.Self : Players.Opponent,
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage) {
                            if(choice === 'Yes') {
                                context.game.addMessage('{0} chooses to trigger {1}\'s ability', context.player, context.game.currentConflict.conflictProvince);
                            } else {
                                context.game.addMessage('{0} chooses not to trigger {1}\'s ability', context.player, context.game.currentConflict.conflictProvince);
                            }
                        }
                        return { target: (choice === 'Yes' ? context.game.currentConflict.conflictProvince : []) };
                    },
                    gameAction: AbilityDsl.actions.triggerAbility(context => {
                        const conflictProvince = context.game.currentConflict.conflictProvince;
                        return {
                            player: duel.winner ? duel.winner.controller : context.player,
                            ability: duel.winner ? conflictProvince.abilities.actions[0] : [],
                            ignoredRequirements: ['limit']
                        };
                    })
                }))
            }
        });
    }
}

CunningNegotiator.id = 'cunning-negotiator';

module.exports = CunningNegotiator;
