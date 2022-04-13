import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { GameAction } from './GameAction';
import { Locations, EventNames, TargetModes, Decks, Players } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');
import { Helpers } from '../Utils/helpers';

export interface DeckSearchProperties extends PlayerActionProperties {
    targetMode?: TargetModes;
    activePromptTitle?: string;
    amount?: number | ((context: AbilityContext) => number);
    numCards?: number | ((context: AbilityContext) => number);
    reveal?: boolean;
    deck?: Decks;
    shuffle?: Boolean | ((context: AbilityContext) => Boolean);
    title?: String;
    gameAction?: GameAction;
    message?: string;
    uniqueNames?: boolean;
    player?: Player;
    choosingPlayer?: Player;
    placeOnBottomInRandomOrder?: boolean;
    messageArgs?: (context: AbilityContext, cards) => any | any[];
    selectedCardsHandler?: (context, event, cards) => void;
    remainingCardsHandler?: (context, event, cards) => void;
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
}

export class DeckSearchAction extends PlayerAction {
    name = 'deckSearch';
    eventName = EventNames.OnDeckSearch;

    defaultProperties: DeckSearchProperties = {
        amount: -1,
        numCards: 1,
        targetMode: TargetModes.Single,
        deck: Decks.ConflictDeck,
        selectedCardsHandler: null,
        remainingCardsHandler: null,
        shuffle: true,
        reveal: true,
        uniqueNames: false,
        placeOnBottomInRandomOrder: false,
        cardCondition: () => true
    };

    getNumCards(numCards, context) : number {
        if (typeof numCards === 'function') {
            return numCards(context);
        }
        return numCards;
    }

    getAmount(amount, context) : number {
        if (typeof amount === 'function') {
            return amount(context);
        }
        return amount;
    }

    getShuffle(shuffle, context) : Boolean {
        if (typeof shuffle === 'function') {
            return shuffle(context);
        }
        return shuffle;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        const amount = this.getAmount(properties.amount, context);
        const player = properties.player || context.player;
        return amount !== 0 && this.getDeck(player, properties).size() > 0 && super.canAffect(player, context);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): DeckSearchProperties {
        let properties = super.getProperties(context, additionalProperties) as DeckSearchProperties;
        if(properties.reveal === undefined) {
            properties.reveal = properties.cardCondition !== undefined;            
        }
        properties.cardCondition = properties.cardCondition || (() => true);
        return properties;
    }
    
    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DeckSearchProperties;
        let message = 'search their deck';
        let amount = this.getAmount(properties.amount, context); 
        if(amount > 0) {
            message = 'look at the top ' + (amount > 1 ? amount + ' cards' : 'card') + ' of their deck';
        }
        return [message, []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let amount = this.getAmount(properties.amount, context); 
        return amount !== 0 && this.getDeck(player, properties).size() > 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as DeckSearchProperties;        
        let fAmount = this.getAmount(amount, context);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = fAmount;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let player = properties.player || context.player;
        let event = this.getEvent(player, context) as any;
        let amount = event.amount > -1 ? event.amount : this.getDeck(player, properties).size();
        let cards = this.getDeck(player, properties).first(amount);
        if(event.amount === -1) {
            cards = cards.filter(card => properties.cardCondition(card, context));
        }
        events.push(event);
        let selectedCards = [];
        this.selectCard(event, additionalProperties, cards, selectedCards);
    }

    selectCard(event, additionalProperties, cards, selectedCards) {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let canCancel = properties.targetMode !== TargetModes.Exactly;
        let selectAmount = 1;
        let choosingPlayer = properties.choosingPlayer || event.player;

        if (properties.targetMode === TargetModes.UpTo || properties.targetMode === TargetModes.UpToVariable)
            selectAmount = this.getNumCards(properties.numCards, context);
        if (properties.targetMode === TargetModes.Single)
            selectAmount = 1;
        if (properties.targetMode === TargetModes.Exactly || properties.targetMode === TargetModes.ExactlyVariable)
            selectAmount = this.getNumCards(properties.numCards, context);
        if (properties.targetMode === TargetModes.Unlimited)
            selectAmount = -1;
        
        let title = properties.activePromptTitle;
        if (!properties.activePromptTitle) {
            title = 'Select a card' + (properties.reveal ? ' to reveal' : '');
            if (selectAmount < 0 || selectAmount > 1) {
                title = `Select ${selectAmount < 0 ? 'all' : ('up to '+ selectAmount)} cards` + (properties.reveal ? ' to reveal' : '');
            }
        }

        if (properties.shuffle) {
            cards.sort(card => card.name)
        }

        context.game.promptWithHandlerMenu(choosingPlayer, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardCondition: (card, context) => {
                return properties.cardCondition(card, context) &&
                    (!properties.uniqueNames || !selectedCards.some(sel => sel.name === card.name)) &&
                    (!properties.gameAction || properties.gameAction.canAffect(card, context, additionalProperties))
            },
            choices: canCancel ? (selectedCards.length > 0 ? ['Done'] : ['Take nothing']) : ([]),
            handlers: [() => {
                this.handleDone(properties, context, event, selectedCards, cards);
            }],
            cardHandler: card => {
                selectedCards = selectedCards.concat(card);
                let index = cards.indexOf(card, 0);
                if (index > -1)
                    cards.splice(index, 1);
                if ((selectAmount < 0 || selectedCards.length < selectAmount) && cards.length > 0) {
                    this.selectCard(event, additionalProperties, cards, selectedCards);
                }
                else {
                    this.handleDone(properties, context, event, selectedCards, cards);
                }
            }
        });
    }

    handleDone(properties : DeckSearchProperties, context, event, selectedCards, allCards) {
        event.selectedCards = selectedCards;
        if (properties.selectedCardsHandler === null) {
            this.defaultHandleDone(properties, context, event, selectedCards);
        }
        else {
            properties.selectedCardsHandler(context, event, selectedCards);
        }

        if (properties.remainingCardsHandler === null) {
            if (this.getShuffle(properties.shuffle, context)) {
                if (properties.deck === Decks.ConflictDeck) {
                    event.player.shuffleConflictDeck();
                } else if (properties.deck === Decks.DynastyDeck) {
                    event.player.shuffleDynastyDeck();
                }
            } else if (properties.placeOnBottomInRandomOrder) {
                let cardsToMove = [...allCards];
                selectedCards.forEach(card => cardsToMove = cardsToMove.filter(a => a !== card));
                if(cardsToMove.length > 0) {
                    Helpers.shuffleArray(cardsToMove);
                    cardsToMove.forEach(c => {
                        event.player.moveCard(c, Locations.ConflictDeck, { bottom: true });
                    });
                    context.game.addMessage('{0} puts {1} card{2} on the bottom of their conflict deck', event.player, cardsToMove.length, cardsToMove.length > 1 ? 's' : '');
                }
            }
        } else {
            let cardsToMove = [...allCards];
            selectedCards.forEach(card => cardsToMove = cardsToMove.filter(a => a !== card));
            properties.remainingCardsHandler(context, event, cardsToMove);
        }
    }

    getDeck(player : Player, properties : DeckSearchProperties) {
        if (properties.deck === Decks.DynastyDeck) {
            return player.dynastyDeck;
        }

        return player.conflictDeck;
    }

    defaultHandleDone(properties : DeckSearchProperties, context, event, selectedCards) {
        let choosingPlayer = properties.choosingPlayer || event.player;

        if (properties.message) {
            let args = [];
            if (properties.messageArgs) {
                args = properties.messageArgs(context, selectedCards);
            }
            context.game.addMessage(properties.message, ...args);
        } else {
            if (selectedCards.length > 0) {
                if (properties.reveal) {
                    context.game.addMessage('{0} takes {1}', choosingPlayer, selectedCards);
                }
                else {
                    context.game.addMessage('{0} takes {1} {2}', choosingPlayer, selectedCards.length, selectedCards.length > 1 ? 'cards' : 'card');
                }    
            } else {
                context.game.addMessage('{0} takes nothing', choosingPlayer);
            }
        }
        let { gameAction } = this.getProperties(event.context);
        if(gameAction) {
            gameAction.setDefaultTarget(() => selectedCards);
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context)) {
                    gameAction.resolve(null, context);
                }
            });
        }
    }
}
