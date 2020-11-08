import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { GameAction } from './GameAction';
import { Locations, EventNames, TargetModes, Decks } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');

export interface DeckSearchProperties extends PlayerActionProperties {
    targetMode?: TargetModes;
    activePromptTitle?: string;
    amount?: number | ((context: AbilityContext) => number);
    numCards?: number;
    reveal?: boolean;
    deck?: Decks;
    shuffle?: Boolean | ((context: AbilityContext) => Boolean);
    title?: String;
    gameAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext, cards) => any | any[];
    selectedCardsHandler?: (context, event, cards) => void;
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
        shuffle: true,
        reveal: true,
        cardCondition: () => true
    };

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

    hasLegalTarget(): boolean {
        return true;
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
        let event = this.getEvent(context.player, context) as any;
        let player = context.player;
        let amount = event.amount > -1 ? event.amount : this.getDeck(player, properties).size();
        let cards = this.getDeck(player, properties).first(amount);
        if(properties.amount === -1) {
            cards = cards.filter(card => properties.cardCondition(card, context));
        }
        events.push(event);
        let selectedCards = [];
        this.selectCard(event, additionalProperties, cards, selectedCards);
    }

    eventHandler(event, additionalProperties): void {
        // let selectedCards = [];
        // this.selectCard(event, additionalProperties, cards, selectedCards);
    }

    selectCard(event, additionalProperties, cards, selectedCards) {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let canCancel = properties.targetMode !== TargetModes.Exactly;
        let selectAmount = 1;

        if (properties.targetMode === TargetModes.UpTo)
            selectAmount = properties.numCards;
        if (properties.targetMode === TargetModes.Single)
            selectAmount = 1;
        if (properties.targetMode === TargetModes.Exactly)
            selectAmount = properties.numCards;
        if (properties.targetMode === TargetModes.Unlimited)
            selectAmount = -1;
        
        let title = properties.activePromptTitle;
        if (!properties.activePromptTitle) {
            title = 'Select a card' + (properties.reveal ? ' to reveal' : '');
            if (selectAmount < 0 || selectAmount > 1) {
                title = 'Select all cards' + (properties.reveal ? ' to reveal' : '');
            }
        }

        context.game.promptWithHandlerMenu(player, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardCondition: (card, context) => properties.cardCondition(card, context) && (!properties.gameAction || properties.gameAction.canAffect(card, context, additionalProperties)),
            choices: canCancel ? (selectedCards.length > 0 ? ['Done'] : ['Take nothing']) : ([]),
            handlers: [() => {
                this.handleDone(properties, context, event, selectedCards);
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
                    this.handleDone(properties, context, event, selectedCards);
                }
            }
        });
    }

    handleDone(properties : DeckSearchProperties, context, event, selectedCards) {
        event.selectedCards = selectedCards;
        if (properties.selectedCardsHandler == null) {
            this.defaultHandleDone(properties, context, event, selectedCards);
        }
        else {
            properties.selectedCardsHandler(context, event, selectedCards);
        }

        if (this.getShuffle(properties.shuffle, context)) {
            if (properties.deck === Decks.ConflictDeck) {
                event.player.shuffleConflictDeck();
            } else if (properties.deck === Decks.DynastyDeck) {
                event.player.shuffleDynastyDeck();
            }
        }
    }

    getDeck(player : Player, properties : DeckSearchProperties) {
        if (properties.deck === Decks.DynastyDeck) {
            return player.dynastyDeck;
        }

        return player.conflictDeck;
    }

    defaultHandleDone(properties : DeckSearchProperties, context, event, selectedCards) {
        if (properties.message) {
            let args = [];
            if (properties.messageArgs) {
                args = properties.messageArgs(context, selectedCards);
            }
            context.game.addMessage(properties.message, ...args);
        } else {
            if (selectedCards.length > 0) {
                if (properties.reveal) {
                    context.game.addMessage('{0} takes {1}', event.player, selectedCards);
                }
                else {
                    context.game.addMessage('{0} takes {1} {2}', event.player, selectedCards.length, selectedCards.length > 1 ? 'cards' : 'card');
                }    
            } else {
                context.game.addMessage('{0} takes nothing', event.player);
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
