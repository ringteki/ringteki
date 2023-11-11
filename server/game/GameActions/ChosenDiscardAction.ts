import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import BaseCard = require('../basecard');

import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { Locations, Players, TargetModes, EventNames } from '../Constants';

export interface ChosenDiscardProperties extends PlayerActionProperties {
    amount?: number;
    targets?: boolean;
    cardCondition?: (card: BaseCard, context: AbilityContext) => boolean;
}

export class ChosenDiscardAction extends PlayerAction {
    defaultProperties: ChosenDiscardProperties = {
        amount: 1,
        targets: true,
        cardCondition: () => true,
    };
    name = 'discard';
    eventName = EventNames.OnCardsDiscardedFromHand;

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ChosenDiscardProperties;
        return ['make {0} discard {1} cards', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ChosenDiscardProperties;
        const availableHand = player.hand.filter(card => properties.cardCondition(card, context));

        if(availableHand.length === 0 || properties.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties) as ChosenDiscardProperties;
        for(let player of properties.target as Player[]) {
            const availableHand = player.hand.filter(card => properties.cardCondition(card, context));
            let amount = Math.min(availableHand.length, properties.amount);
            if(amount > 0) {
                if(amount >= availableHand.length) {
                    let event = this.getEvent(player, context) as any;
                    event.cards = availableHand;
                    events.push(event);
                    return;
                }

                if(properties.targets && context.choosingPlayerOverride && context.choosingPlayerOverride !== player) {
                    let event = this.getEvent(player, context) as any;
                    event.cards = availableHand.slice(0, amount);
                    events.push(event);
                    return;
                }
                context.game.promptForSelect(player, {
                    activePromptTitle: 'Choose ' + (amount === 1 ? 'a card' : (amount + ' cards')) + ' to discard',
                    context: context,
                    mode: TargetModes.Exactly,
                    numCards: amount,
                    location: Locations.Hand,
                    controller: player === context.player ? Players.Self : Players.Opponent,
                    cardCondition: card => properties.cardCondition(card, context),
                    onSelect: (player, cards) => {
                        let event = this.getEvent(player, context) as any;
                        event.cards = cards;
                        events.push(event);
                        return true;
                    }
                });
            }
        }
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as ChosenDiscardProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.cards = [];
        event.discardedAtRandom = false;
    }

    eventHandler(event): void {
        event.context.game.addMessage('{0} discards {1}', event.player, event.cards);
        event.discardedCards = event.cards;
        for(let card of event.cards) {
            event.player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }
}
