import AbilityContext from '../../../AbilityContext';
import { Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';
import ProvinceCard from '../../../provincecard';

type CardHandler = (currentCard: DrawCard) => void;

class Process {
    cardsToRemove: Set<DrawCard> = new Set();

    constructor(public topCards: DrawCard[]) {}

    markCardForRemoval(card: DrawCard) {
        const idx = this.topCards.indexOf(card);
        if (idx > -1) {
            this.topCards.splice(idx, 1);
        }
        this.cardsToRemove.add(card);
    }
}

export default class HeartAttackGrill extends ProvinceCard {
    static id = 'heart-attack-grill';

    setupCardAbilities() {
        this.interrupt({
            title: "Look at the top 8 cards of the attacker's deck and remove up to 3 from the game",
            when: {
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.game.currentConflict && Boolean(context.player.opponent)
            },
            gameAction: AbilityDsl.actions.handler({
                handler: (context) =>
                    this.#startPrompt(context, new Process(context.player.opponent.conflictDeck.first(8)))
            })
        });
    }

    #startPrompt(context: AbilityContext, process: Process) {
        if (process.topCards.length === 0) {
            return;
        }

        const cardHandler: CardHandler = (currentCard) => {
            process.markCardForRemoval(currentCard);
            this.#stepPrompt(context, process, cardHandler);
        };

        this.#stepPrompt(context, process, cardHandler);
    }

    #stepPrompt(context: AbilityContext, process: Process, cardHandler: CardHandler) {
        if (process.topCards.length === 0 || process.cardsToRemove.size === 3) {
            return this.#handleProcess(context, process);
        }

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: `Select a card to remove from the game (${process.cardsToRemove.size} of 3)`,
            context: context,
            cards: process.topCards,
            cardHandler: cardHandler,
            choices: ['Done'],
            handlers: [() => this.#handleProcess(context, process)]
        });
    }

    #handleProcess(context: AbilityContext, process: Process) {
        if (process.cardsToRemove.size > 0) {
            this.game.addMessage('{0} remove {1} from the game', context.player, Array.from(process.cardsToRemove));
            for (const card of process.cardsToRemove) {
                context.player.moveCard(card, Locations.RemovedFromGame);
            }
        }
        this.game.addMessage(
            `{0} returns the {1}cards to the top of {2} deck in the same order`,
            context.player,
            process.cardsToRemove.size > 0 ? 'other ' : '',
            context.player.opponent
        );
    }
}
