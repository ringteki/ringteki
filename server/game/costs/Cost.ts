import type { AbilityContext } from '../AbilityContext.js';
import type { MsgArg } from '../GameChat.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';

export type Result = {
    canCancel?: boolean;
    cancelled?: boolean;
};

export interface Cost {
    canPay(context: AbilityContext): boolean;

    action?: GameAction;
    activePromptTitle?: string;

    selectCardName?(player: Player, cardName: string, context: AbilityContext): boolean;
    promptsPlayer?: boolean;
    dependsOn?: string;
    isPrintedFateCost?: boolean;
    isPlayCost?: boolean;
    canIgnoreForTargeting?: boolean;
    payFateCostToOpponent?: boolean;

    getActionName?(context: AbilityContext): string;
    getCostMessage?(context: AbilityContext): MsgArg[];
    hasTargetsChosenByInitiatingPlayer?(context: AbilityContext): boolean;
    addEventsToArray?(events: Event[], context: AbilityContext, result?: Result): void;
    resolve?(context: AbilityContext, result: Result): void;
    payEvent?(context: TriggeredAbilityContext): Event | Event[];
    pay?(context: TriggeredAbilityContext): void;
}
