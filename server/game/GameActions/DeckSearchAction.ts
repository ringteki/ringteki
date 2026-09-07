import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Decks, EventName, Location, TargetMode } from '../Constants.js';
import { shuffle } from '../utils/shuffle.js';
import type DrawCard from '../DrawCard.js';
import type { GameAction } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type Player from '../Player.js';

import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
type Derivable<T> = T | ((context: AbilityContext) => T);

export interface DeckSearchProperties extends PlayerActionProperties {
    targetMode?: TargetMode;
    activePromptTitle?: string;
    amount?: number | ((context: AbilityContext) => number);
    numCards?: number | ((context: AbilityContext) => number);
    reveal?: boolean;
    deck?: Decks;
    shuffle?: boolean | ((context: AbilityContext) => boolean);
    title?: string;
    gameAction?: GameAction;
    message?: string;
    uniqueNames?: boolean;
    player?: Player;
    choosingPlayer?: Player;
    placeOnBottomInRandomOrder?: boolean;
    messageArgs?: (context: AbilityContext, cards: DrawCard[]) => unknown[];
    selectedCardsHandler?: (context: AbilityContext, event: Event, cards: DrawCard[]) => void;
    remainingCardsHandler?: (context: AbilityContext, event: Event, cards: DrawCard[]) => void;
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    takesNothingGameAction?: GameAction;
}

export class DeckSearchAction extends PlayerAction<DeckSearchProperties, EventName.OnDeckSearch> {
    name = 'deckSearch';
    eventName = EventName.OnDeckSearch;

    defaultProperties: DeckSearchProperties = {
        amount: -1,
        numCards: 1,
        targetMode: TargetMode.Single,
        deck: Decks.ConflictDeck,
        selectedCardsHandler: undefined,
        remainingCardsHandler: undefined,
        takesNothingGameAction: undefined,
        shuffle: true,
        reveal: true,
        uniqueNames: false,
        placeOnBottomInRandomOrder: false,
        cardCondition: () => true
    };

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        if(this.#getAmount(properties.amount ?? -1, context) === 0) {
            return false;
        }
        const player = properties.player || context.player;
        return this.#getDeck(player, properties).length > 0 && super.canAffect(player, context);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): DeckSearchProperties {
        const properties = super.getProperties(context, additionalProperties) as DeckSearchProperties;
        if(properties.reveal === undefined) {
            properties.reveal = properties.cardCondition !== undefined;
        }
        properties.cardCondition = properties.cardCondition || (() => true);
        return properties;
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        const properties = this.getProperties(context);
        const amount = this.#getAmount(properties.amount ?? -1, context);
        const message =
            amount > 0
                ? `look at the top ${amount === 1 ? 'card' : `${amount} cards`} of their deck`
                : 'search their deck';
        return [message, []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        const amount = this.#getAmount(properties.amount ?? -1, context);
        return amount !== 0 && this.#getDeck(player, properties).length > 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnDeckSearch>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { amount } = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        const fAmount = this.#getAmount(amount ?? -1, context);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = fAmount;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        const player = properties.player || context.player;
        const event = this.getEvent(player, context);
        const evAmount = event.amount ?? -1;
        const amount = evAmount > -1 ? evAmount : this.#getDeck(player, properties).length;
        let cards = this.#getDeck(player, properties).slice(0, amount);
        const cardCondition = properties.cardCondition ?? (() => true);
        if(evAmount === -1) {
            cards = cards.filter((card) => cardCondition(card, context));
        }
        events.push(event);
        this.#selectCard(event, additionalProperties, cards, new Set());
    }

    #getNumCards(numCards: Derivable<number>, context: AbilityContext): number {
        return typeof numCards === 'function' ? numCards(context) : numCards;
    }

    #getAmount(amount: Derivable<number>, context: AbilityContext): number {
        return typeof amount === 'function' ? amount(context) : amount;
    }

    #shouldShuffle(shuffle: Derivable<boolean>, context: AbilityContext): boolean {
        return typeof shuffle === 'function' ? shuffle(context) : shuffle;
    }

    #getDeck(player: Player, properties: DeckSearchProperties): DrawCard[] {
        switch(properties.deck) {
            case Decks.DynastyDeck:
                return player.dynastyDeck.slice();
            case Decks.ConflictDeck:
                return player.conflictDeck.slice();
            default:
                return [];
        }
    }

    #selectCard(event: GameEvent<EventName.OnDeckSearch>, additionalProperties: Record<string, unknown> = {}, cards: DrawCard[], selectedCards: Set<DrawCard>): void {
        const context: AbilityContext = (event.context as AbilityContext);
        const properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        const canCancel = properties.targetMode !== TargetMode.Exactly;
        let selectAmount = 1;
        const choosingPlayer = (properties.choosingPlayer || event.player) as Player;

        if(properties.targetMode === TargetMode.UpTo || properties.targetMode === TargetMode.UpToVariable) {
            selectAmount = this.#getNumCards(properties.numCards ?? 1, context);
        }
        if(properties.targetMode === TargetMode.Single) {
            selectAmount = 1;
        }
        if(properties.targetMode === TargetMode.Exactly || properties.targetMode === TargetMode.ExactlyVariable) {
            selectAmount = this.#getNumCards(properties.numCards ?? 1, context);
        }
        if(properties.targetMode === TargetMode.Unlimited) {
            selectAmount = -1;
        }

        let title = properties.activePromptTitle;
        if(!properties.activePromptTitle) {
            title = 'Select a card' + (properties.reveal ? ' to reveal' : '');
            if(selectAmount < 0 || selectAmount > 1) {
                title =
                    `Select ${selectAmount < 0 ? 'all' : 'up to ' + selectAmount} cards` +
                    (properties.reveal ? ' to reveal' : '');
            }
        }

        if(properties.shuffle) {
            cards.sort((a, b) => a.name.localeCompare(b.name));
        }

        context.game.promptWithHandlerMenu(choosingPlayer, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardCondition: (card: DrawCard, context: AbilityContext) =>
                (properties.cardCondition ?? (() => true))(card, context) &&
                (!properties.uniqueNames || !Array.from(selectedCards).some((sel) => sel.name === card.name)) &&
                (!properties.gameAction || properties.gameAction.canAffect(card, context, additionalProperties)),
            choices: canCancel ? (selectedCards.size > 0 ? ['Done'] : ['Take nothing']) : [],
            handlers: [() => this.#handleDone(properties, context, event, selectedCards, cards)],
            cardHandler: (card: DrawCard) => {
                const newSelectedCards = new Set(selectedCards);
                newSelectedCards.add(card);
                const index = cards.indexOf(card, 0);
                if(index > -1) {
                    cards.splice(index, 1);
                }
                if((selectAmount < 0 || newSelectedCards.size < selectAmount) && cards.length > 0) {
                    this.#selectCard(event, additionalProperties, cards, newSelectedCards);
                } else {
                    this.#handleDone(properties, context, event, newSelectedCards, cards);
                }
            }
        });
    }

    #handleDone(
        properties: DeckSearchProperties,
        context: AbilityContext,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>,
        allCards: DrawCard[]
    ): void {
        event.selectedCards = Array.from(selectedCards);
        context.deckSearchSelected = Array.from(selectedCards);
        if(!properties.selectedCardsHandler) {
            this.#defaultHandleDone(properties, context, event, selectedCards);
        } else {
            properties.selectedCardsHandler(context, event, Array.from(selectedCards));
        }

        if(typeof properties.remainingCardsHandler === 'function') {
            const cardsToMove = allCards.filter((card) => !selectedCards.has(card));
            properties.remainingCardsHandler(context, event, cardsToMove);
        } else {
            this.#defaultRemainingCardsHandler(properties, context, event, selectedCards, allCards);
        }
    }

    #defaultRemainingCardsHandler(
        properties: DeckSearchProperties,
        context: AbilityContext,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>,
        allCards: DrawCard[]
    ): void {
        const player = event.player as Player;
        if(this.#shouldShuffle(properties.shuffle ?? false, context)) {
            switch(properties.deck) {
                case Decks.ConflictDeck:
                    return player.shuffleConflictDeck();
                case Decks.DynastyDeck:
                    return player.shuffleDynastyDeck();
                default:
                    return;
            }
        }

        if(properties.placeOnBottomInRandomOrder) {
            const cardsToMove = allCards.filter((card) => !selectedCards.has(card));
            if(cardsToMove.length > 0) {
                const isDynasty = properties.deck === Decks.DynastyDeck;
                const deckLocation = isDynasty ? Location.DynastyDeck : Location.ConflictDeck;
                for(const card of shuffle(cardsToMove)) {
                    player.moveCard(card, deckLocation, { bottom: true });
                }
                context.game.addMessage(
                    '{0} puts {1} card{2} on the bottom of their {3} deck',
                    player,
                    cardsToMove.length,
                    cardsToMove.length > 1 ? 's' : '',
                    isDynasty ? 'dynasty' : 'conflict'
                );
            }
        }
    }

    #defaultHandleDone(
        properties: DeckSearchProperties,
        context: AbilityContext,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>
    ): void {
        this.#doneMessage(properties, context, event, selectedCards);

        const gameAction = this.getProperties(context).gameAction;
        if(gameAction) {
            const selectedArray = Array.from(selectedCards);
            gameAction.setDefaultTarget(() => selectedArray);
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context)) {
                    gameAction.resolve(undefined, context);
                }
                return true;
            });
        }
    }

    #doneMessage(
        properties: DeckSearchProperties,
        context: AbilityContext,
        event: GameEvent<EventName.OnDeckSearch>,
        selectedCards: Set<DrawCard>
    ): void {
        const choosingPlayer = (properties.choosingPlayer || event.player) as Player;
        if(selectedCards.size > 0 && properties.message) {
            const args = properties.messageArgs ? properties.messageArgs(context, Array.from(selectedCards)) : [];
            return context.game.addMessage(properties.message, ...(args as MsgArg[]));
        }

        if(selectedCards.size === 0) {
            return this.#takesNothing(properties, context, event);
        }

        if(properties.reveal) {
            return context.game.addMessage('{0} takes {1}', choosingPlayer, Array.from(selectedCards));
        }

        context.game.addMessage(
            '{0} takes {1} {2}',
            choosingPlayer,
            selectedCards.size,
            selectedCards.size > 1 ? 'cards' : 'card'
        );
    }

    #takesNothing(properties: DeckSearchProperties, context: AbilityContext, event: GameEvent<EventName.OnDeckSearch>): void {
        const choosingPlayer = (properties.choosingPlayer || event.player) as Player;
        context.game.addMessage('{0} takes nothing', choosingPlayer);
        if(properties.takesNothingGameAction) {
            const action = properties.takesNothingGameAction;
            context.game.queueSimpleStep(() => {
                if(action.hasLegalTarget(context)) {
                    action.resolve(undefined, context);
                }
                return true;
            });
        }
    }
}
