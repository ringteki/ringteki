import { CharacterStatus, Decks, Location, TargetMode } from '../Constants.js';
import * as GameActions from '../GameActions/GameActions.js';
import { ReturnToDeckProperties } from '../GameActions/ReturnToDeckAction.js';
import { SelectCardProperties } from '../GameActions/SelectCardAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { Cost } from './Cost.js';
import { getSelectCost, type SelectCostProperties } from './costHelpers.js';
import { GameActionCost } from './GameActionCost.js';
import { MetaActionCost } from './MetaActionCost.js';

/**
 * Cost that will bow the card that initiated the ability.
 */
export function bowSelf(): Cost {
    return new GameActionCost(GameActions.bow());
}
/**
 * Cost that will bow the card that the card that initiated the ability is attached to.
 */
export function bowParent(): Cost {
    return new GameActionCost(GameActions.bow((context) => ({ target: context.source.parent })));
}

/**
 * Cost that requires bowing a card that matches the passed condition
 * predicate function.
 */
export function bow(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.bow(), properties, 'Select card to bow');
}

/**
 * Cost that will move home the card that initiated the ability.
 */
export function moveHomeSelf(): Cost {
    return new GameActionCost(GameActions.sendHome((context) => ({ target: context.source })));
}

/**
 * Cost that will send the target to the conflict.
 */
export function moveToConflict(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.moveToConflict(), properties, 'Select card to move to the conflict');
}

/**
 * Cost that will sacrifice the card that initiated the ability.
 */
export function sacrificeSelf(): Cost {
    return new GameActionCost(GameActions.sacrifice());
}

/**
 * Cost that requires sacrificing a card that matches the passed condition
 * predicate function.
 */
export function sacrifice(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.sacrifice(), properties, 'Select card to sacrifice');
}

/**
 * Cost that will return a selected card to hand which matches the passed
 * condition.
 */
export function returnToHand(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.returnToHand(), properties, 'Select card to return to hand');
}

/**
 * Cost that will return a selected card to the appropriate deck which matches the passed
 * condition.
 */
export function returnToDeck(properties: ReturnToDeckProperties & SelectCostProperties): Cost {
    return getSelectCost(GameActions.returnToDeck(properties), properties, 'Select card to return to your deck');
}

/**
 * Cost that will return to hand the card that initiated the ability.
 */
export function returnSelfToHand(): Cost {
    return new GameActionCost(GameActions.returnToHand());
}

/**
 * Cost that will shuffle a selected card into the relevant deck which matches the passed
 * condition.
 */
export function shuffleIntoDeck(properties: SelectCostProperties): Cost {
    return getSelectCost(
        GameActions.moveCard({ destination: Location.DynastyDeck, shuffle: true }),
        properties,
        'Select card to shuffle into deck'
    );
}

/**
 * Cost that requires discarding a specific card.
 */
export function discardCardSpecific(cardFunc: (context: AbilityContext) => DrawCard | DrawCard[]): Cost {
    return new GameActionCost(GameActions.discardCard((context) => ({ target: cardFunc(context) })));
}

/**
 * Cost that requires discarding itself from hand.
 */
export function discardSelf(): Cost {
    return new GameActionCost(GameActions.discardCard((context) => ({ target: context.source })));
}

/**
 * Cost that requires discarding a card to be selected by the player.
 */
export function discardCard(properties?: SelectCostProperties): Cost {
    return getSelectCost(
        GameActions.discardCard(),
        Object.assign({ location: Location.Hand, mode: TargetMode.Exactly }, properties),
        (properties?.numCards ?? 0) > 1 ? `Select ${properties?.numCards} cards to discard` : 'Select card to discard'
    );
}

export function discardTopCardsFromDeck(properties: { amount: number; deck: Decks }): Cost {
    const getDeck =
        properties.deck === Decks.DynastyDeck
            ? (context: AbilityContext) => context.player.dynastyDeck
            : (context: AbilityContext) => context.player.conflictDeck;
    const destination =
        properties.deck === Decks.DynastyDeck ? Location.DynastyDiscardPile : Location.ConflictDiscardPile;
    return {
        getActionName: (_context) => 'discardTopCardsFromDeck',
        getCostMessage: (_context) => ['discarding {0}'],
        canPay: (context) => getDeck(context).length >= properties.amount,
        resolve: (context) => {
            context.costs.discardTopCardsFromDeck = getDeck(context).slice(0, properties.amount);
        },
        pay: (context) => {
            for(const card of context.costs.discardTopCardsFromDeck as DrawCard[]) {
                card.controller.moveCard(card, destination);
            }
        }
    };
}

/**
 * Cost that will discard a fate from the card
 */
export function removeFateFromSelf(): Cost {
    return new GameActionCost(GameActions.removeFate());
}

/**
 * Cost that will discard a fate from a selected card
 */
export function removeFate(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.removeFate(), properties, 'Select character to discard a fate from');
}

/**
 * Cost that will discard a fate from the card's parent
 */
export function removeFateFromParent(): Cost {
    return new GameActionCost(GameActions.removeFate((context) => ({ target: context.source.parent })));
}

/**
 * Cost that requires removing a card selected by the player from the game.
 */
export function removeFromGame(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.removeFromGame(), properties, 'Select card to remove from game');
}

/**
 * Cost that requires removing a card selected by the player from the game.
 */
export function removeSelfFromGame(properties?: { location: Array<Location> }): Cost {
    return new GameActionCost(GameActions.removeFromGame(properties));
}

/**
 * Cost that will dishonor the character that initiated the ability
 */
export function dishonorSelf(): Cost {
    return new GameActionCost(GameActions.dishonor());
}

/**
 * Cost that requires dishonoring a card to be selected by the player
 */
export function dishonor(properties?: SelectCostProperties): Cost {
    return getSelectCost(GameActions.dishonor(), properties, 'Select character to dishonor');
}

/**
 * Cost that requires tainting a card to be selected by the player
 */
export function taint(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.taint(), properties, 'Select card to taint');
}

/**
 * Cost that requires tainting yourself
 */
export function taintSelf(): Cost {
    return new GameActionCost(GameActions.taint());
}

export function discardStatusToken(properties: Omit<SelectCardProperties, 'gameAction' | 'subActionProperties'>): Cost {
    return new MetaActionCost(
        GameActions.selectCard(
            Object.assign(
                {
                    gameAction: GameActions.discardStatusToken(),
                    subActionProperties: (card: DrawCard) => ({ target: card.getStatusToken(CharacterStatus.Honored) })
                },
                properties
            )
        ),
        'Select character to discard honored status token from'
    );
}

/**
 * Cost that will discard the status token on a card to be selected by the player
 */
export function discardStatusTokenFromSelf(): Cost {
    return new GameActionCost(GameActions.discardStatusToken());
}

/**
 * Cost that will break the province that initiated the ability
 */
export function breakSelf(): Cost {
    return new GameActionCost(GameActions.breakProvince());
}

/**
 * Cost that requires breaking a province selected by the player
 */
export function breakProvince(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.breakProvince(), properties, 'Select a province to break');
}

/**
 * Cost that will put into play the card that initiated the ability
 */
export function putSelfIntoPlay(): Cost {
    return new GameActionCost(GameActions.putIntoPlay());
}

/**
 * Cost that will prompt for a card
 */
export function selectedReveal(properties: SelectCostProperties): Cost {
    return getSelectCost(GameActions.reveal(), properties, `Select a ${properties.cardType || 'card'} to reveal`);
}

/**
 * Cost that will reveal specific cards
 */
export function reveal(cardFunc: (context: AbilityContext) => BaseCard[]): Cost {
    return new GameActionCost(GameActions.reveal((context) => ({ target: cardFunc(context) })));
}

/**
 * Cost that discards the Imperial Favor
 */
export function discardImperialFavor(): Cost {
    return new GameActionCost(GameActions.loseImperialFavor((context) => ({ target: context.player })));
}

export function switchLocation(): Cost {
    return {
        promptsPlayer: false,
        canPay(context: TriggeredAbilityContext) {
            const canMoveHome = context.game.actions.sendHome().canAffect(context.source, context);
            const canMoveToConflict = context.game.actions.moveToConflict().canAffect(context.source, context);

            return canMoveHome || canMoveToConflict;
        },
        getActionName(_context: TriggeredAbilityContext) {
            return 'switchLocation';
        },
        getCostMessage(context: TriggeredAbilityContext<DrawCard>) {
            if(!context.source.isParticipating()) {
                return ['moving {1} home', [context.source]];
            }
            return ['moving {1} to the conflict', [context.source]];
        },
        resolve(context: TriggeredAbilityContext<DrawCard>, _result) {
            context.costs.switchLocation = context.source;
        },
        payEvent(context: TriggeredAbilityContext<DrawCard>) {
            const action = context.source.isParticipating()
                ? context.game.actions.sendHome({ target: context.costs.switchLocation as BaseCard })
                : context.game.actions.moveToConflict({ target: context.costs.switchLocation as BaseCard });
            return action.getEvent(context.costs.switchLocation, context);
        }
    };
}

export function dishonorAndSacrifice(properties: SelectCostProperties): Cost {
    const gameAction = GameActions.multiple([
        GameActions.dishonor(),
        GameActions.sacrifice()
    ]);
    gameAction.name = 'dishonorAndSacrifice';

    const actionCost = new MetaActionCost(
        GameActions.selectCard(Object.assign({
            gameAction
        }, properties)),
        'Choose a card to dishonor and sacrifice'
    );

    actionCost.getActionName = () => 'dishonorAndSacrifice';
    actionCost.getCostMessage = (context: AbilityContext): MessageArgs => {
        return ['dishonoring and sacrificing {1}', [context.costs.dishonorAndSacrifice as MsgArg]];
    };

    return actionCost;
}
