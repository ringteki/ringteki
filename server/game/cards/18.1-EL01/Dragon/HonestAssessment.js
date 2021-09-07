const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { AbilityTypes } = require('../../../Constants');

class HonestAssessment extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Look at hand',
                cost: AbilityDsl.costs.nameCard(),
                printedAbility: false,
                gameAction: AbilityDsl.actions.conditional({
                    condition: context => context.player.opponent.hand.filter(card => card.name === context.costs.nameCardCost).length > 0,
                    trueGameAction: AbilityDsl.actions.sequentialContext(context => {
                        let cards = context.player.opponent.hand.sort((a, b) => a.name.localeCompare(b.name));
                        let discard = false;
                        return ({
                            gameActions: [
                                AbilityDsl.actions.lookAt(() => ({
                                    target: cards
                                })),
                                AbilityDsl.actions.handler({
                                    handler: () => {
                                        context.game.promptWithHandlerMenu(context.player.opponent, {
                                            activePromptTitle: `Discard a copy of ${context.costs.nameCardCost}?`,
                                            source: context.source,
                                            choices: ['Yes', 'No'],
                                            handlers: [
                                                () => {
                                                    context.game.addMessage('{0} chooses to discard a copy of {1}', context.player.opponent, context.costs.nameCardCost);
                                                    discard = true;
                                                },
                                                () => {
                                                    context.game.addMessage('{0} chooses to let {1} draw a card', context.player.opponent, context.player);
                                                    discard = false;
                                                }
                                            ]
                                        });
                                    }
                                }),
                                AbilityDsl.actions.discardMatching(context => ({
                                    target: discard ? context.player.opponent : [],
                                    cards: cards,
                                    amount: 1,
                                    reveal: false,
                                    match: (context, card) => card.name === context.costs.nameCardCost
                                })),
                                AbilityDsl.actions.draw(context => ({
                                    target: discard ? [] : context.player,
                                    amount: 1
                                }))
                            ]
                        });
                    }),
                    falseGameAction: AbilityDsl.actions.lookAt(context => ({
                        target: context.player.opponent.hand.sortBy(card => card.name)
                    }))
                }),
                effect: 'look at {1}\'s hand for cards named {2}',
                effectArgs: context => [context.player.opponent, context.costs.nameCardCost]
            })
        });
    }
}

HonestAssessment.id = 'honest-assessment';

module.exports = HonestAssessment;
