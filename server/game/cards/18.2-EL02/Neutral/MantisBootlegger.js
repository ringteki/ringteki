const DrawCard = require('../../../drawcard.js');
const { Locations, TargetModes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

const bootleggerCost = function () {
    return {
        canPay: function () {
            return true;
        },
        resolve: function (context, result) {
            let cardAvailable = true;
            if(!context.player.opponent || !context.game.actions.chosenDiscard().canAffect(context.player.opponent, context)) {
                cardAvailable = false;
            }

            context.costs.bootleggerCostPaid = false;
            if(cardAvailable) {
                context.game.promptWithHandlerMenu(context.player.opponent, {
                    activePromptTitle: 'Discard a card?',
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => {
                            context.costs.bootleggerCostPaid = true;
                            context.game.promptForSelect(context.player.opponent, {
                                activePromptTitle: 'Choose a card to discard',
                                context: context,
                                mode: TargetModes.Single,
                                numCards: 1,
                                location: Locations.Hand,
                                controller: Players.Opponent,
                                onSelect: (player, card) => {
                                    context.costs.bootleggerCostDiscardedCard = card;
                                    return true;
                                },
                                onCancel: () => {
                                    result.cancelled = true;
                                    return true;
                                }
                            });
                        },
                        () => context.costs.bootleggerCostPaid = false
                    ]
                });
            }
        },
        payEvent: function (context) {
            if(context.costs.bootleggerCostPaid) {
                let events = [];
                let discardAction = context.game.actions.discardCard({ target: context.costs.bootleggerCostDiscardedCard });
                events.push(discardAction.getEvent(context.costs.bootleggerCostDiscardedCard, context));
                context.game.addMessage('{0} chooses to discard {1}', context.player.opponent, context.costs.bootleggerCostDiscardedCard);
                return events;
            }

            let action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
            return action.getEvent(context.player, context);

        },
        promptsPlayer: true
    };
};

class MantisBootlegger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Wager on the conflict',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source)
            },
            cost: [
                AbilityDsl.costs.discardCard({ location: Locations.Hand }),
                bootleggerCost()
            ],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    until: {
                        onConflictFinished: () => true
                    },
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            afterConflict: (event, context) => event.conflict.winner === context.player
                        },
                        message: '{0} gains {1} fate due to the effect of {2}',
                        messageArgs: effectContext => [effectContext.player, context.costs.bootleggerCostPaid ? 2 : 1, effectContext.source],
                        gameAction: AbilityDsl.actions.gainFate({
                            amount: context.costs.bootleggerCostPaid ? 2 : 1
                        })
                    })
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player.opponent,
                    until: {
                        onConflictFinished: () => true
                    },
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            afterConflict: (event, context) => event.conflict.winner === context.player.opponent
                        },
                        message: '{0} gains {1} fate due to the effect of {2}',
                        messageArgs: effectContext => [effectContext.player.opponent, context.costs.bootleggerCostPaid ? 2 : 1, effectContext.source],
                        gameAction: AbilityDsl.actions.gainFate({
                            amount: context.costs.bootleggerCostPaid ? 2 : 1
                        })
                    })
                }))
            ]),
            effect: 'give the winner of the conflict {1} fate',
            effectArgs: context => [context.costs.bootleggerCostPaid ? 2 : 1]
        });
    }
}

MantisBootlegger.id = 'mantis-bootlegger';
module.exports = MantisBootlegger;
