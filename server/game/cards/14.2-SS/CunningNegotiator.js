const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Players, CardTypes, Locations } = require('../../Constants');

class CunningNegotiator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Political duel to resolve the attacked province\'s action ability',
            condition: context => context.game.currentConflict,
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                message: 'resolve the action ability of an attacked province',
                gameAction: duel => AbilityDsl.actions.menuPrompt(context => ({
                    activePromptTitle: 'Do you want to trigger a province ability?',
                    choices: duel.winner ? ['Yes', 'No'] : [],
                    player: (duel.winner && duel.winner.controller === context.player) ? Players.Self : Players.Opponent,
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage) {
                            if(choice === 'Yes') {
                                context.game.addMessage('{0} chooses to trigger a province ability', context.player);
                            } else {
                                context.game.addMessage('{0} chooses not to trigger a province ability', context.player);
                            }
                        }
                        return { cardCondition: card => (choice === 'Yes' ? card.isConflictProvince() : false) };
                    },
                    gameAction: AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose an attacked province',
                        hidePromptIfSingleCard: true,
                        cardType: CardTypes.Province,
                        location: Locations.Provinces,
                        subActionProperties: card => {
                            context.target = card;
                            return ({ target: card });
                        },
                        gameAction: AbilityDsl.actions.triggerAbility(context => {
                            const conflictProvince = context.target;
                            return {
                                player: duel.winner ? duel.winner.controller : context.source.controller,
                                ability: duel.winner ? conflictProvince.abilities.actions[0] : [],
                                ignoredRequirements: ['limit']
                            };
                        })
                    }))
                }))
            }
        });
    }
}

CunningNegotiator.id = 'cunning-negotiator';

module.exports = CunningNegotiator;
