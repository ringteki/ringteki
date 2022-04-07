const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Players, Locations, CardTypes } = require('../../../Constants');

class CraneIndustry extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            match: player => player.isDefendingPlayer(),
            effect: AbilityDsl.effects.reduceCost({ match: (card, source) => card === source })
        });

        this.reaction({
            when: {
                onConflictStarted: () => true
            },
            title: 'Reduce the cost to play events',
            cost: AbilityDsl.costs.optionalFateCost(1),
            effect: 'reduce the cost of events {1} play{2} this conflict by 1',
            effectArgs: context => context.costs.optionalFateCost > 0 ? ['they', ''] : ['each player', 's'],
            gameAction: AbilityDsl.actions.multipleContext(context => {
                let gameActions = [];
                gameActions.push(AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.reduceCost({
                        amount: 1,
                        match: card => card.type === CardTypes.Event
                    })
                })));
                if (context.player.opponent) {
                    if (context.costs.optionalFateCost === 0) {
                        gameActions.push(AbilityDsl.actions.playerLastingEffect(context => ({
                            targetController: context.player.opponent,
                            effect: AbilityDsl.effects.reduceCost({
                                amount: 1,
                                match: card => card.type === CardTypes.Event
                            })
                        })));    
                    }
                    gameActions.push(AbilityDsl.actions.menuPrompt(context => ({
                        activePromptTitle: 'Give your opponent 1 honor to draw a card?',
                        choices: ['Yes', 'No'],
                        choiceHandler: (choice, displayMessage) => {
                            if(displayMessage) {
                                context.game.addMessage('{0} chooses {1}to give {2} an honor and draw a card', context.player, choice === 'No' ? 'not ' : '', context.player.opponent);
                            }
                            return { amount: choice === 'Yes' ? 1 : 0 };
                        },
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.takeHonor({ target: context.player }),
                            AbilityDsl.actions.draw({ target: context.player })
                        ])
                    })));
                }

                return ({
                    gameActions: gameActions
                });
            })
        });;
    }
}

CraneIndustry.id = 'crane-industry';

module.exports = CraneIndustry;

