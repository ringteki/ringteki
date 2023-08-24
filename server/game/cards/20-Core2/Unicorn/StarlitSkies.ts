import { Locations, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class StarlitSkies extends DrawCard {
    static id = 'starlit-skies';

    setupCardAbilities() {
        this.action({
            title: 'Look at top 3 cards',
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    'Dynasty Deck': context => context.player && context.player.dynastyDeck.size() > 0,
                    'Conflict Deck': context => context.player && context.player.conflictDeck.size() > 0
                }
            },
            effect: 'look at the top 3 cards of {1}\'s {2}',
            effectArgs: context => [context.player, context.select.toLowerCase()],
            handler: context => {
                const topThree: DrawCard[] = (context.select === 'Dynasty Deck') ?
                    context.player.dynastyDeck.first(3) :
                    context.player.conflictDeck.first(3);

                const messages = ['{0} places a card on the bottom of the deck', '{0} chooses to discard {1}'];
                const destinations = [topThree[0].isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom', topThree[0].isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile];
                let choices = [];
                const handlers = [];
                const cardHandler = card => {
                    this.game.addMessage(messages.pop(), context.player, card);
                    context.player.moveCard(card, destinations.pop());
                    if (messages.length > 0) {
                        const index = topThree.findIndex(x => x === card);
                        topThree.splice(index, 1);
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card to put on the bottom of the deck',
                            context: context,
                            cards: topThree,
                            cardHandler: cardHandler,
                            handlers: handlers,
                            choices: choices
                        });
                    }
                };
                if (topThree.length < 3) {
                    choices = ['None'];
                    handlers.push(() => {
                        if (topThree.length === 2) {
                            choices.pop();
                            handlers.pop();
                        }
                        messages.pop();
                        destinations.pop();
                        if (messages.length > 0) {
                            this.game.promptWithHandlerMenu(context.player, {
                                activePromptTitle: 'Select a card to put on the bottom of the deck',
                                context: context,
                                cards: topThree,
                                cardHandler: cardHandler,
                                choices: choices,
                                handlers: handlers
                            });
                        }
                    });
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card to discard',
                    context: context,
                    cards: topThree,
                    cardHandler: cardHandler,
                    handlers: handlers,
                    choices: choices
                });
            }
        });
    }
}
