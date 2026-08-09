import type { AbilityContext } from '../AbilityContext.js';
import type ActionWindow from '../gamesteps/ActionWindow.js';
import type AttackersMatrix from '../gamesteps/conflict/AttackersMatrix.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type { CharacterStatus, ConflictType, Decks, DuelType, EventName, Location, Phases, Players, TokenType } from '../Constants.js';
import type { Direction } from '../GameActions/ModifyBidAction.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import type { Event } from './Event.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type Player from '../Player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';

export interface BaseEventPayload {
    name?: string;
    cancelled?: boolean;
    resolved?: boolean;
    context?: AbilityContext;
    cannotBeCancelled?: boolean;
}

export interface EventPayloadMap {
    [EventName.OnCardPlayed]: BaseEventPayload & {
        player: Player;
        card: DrawCard;
        originalLocation?: Location;
        playType?: string;
    };
    [EventName.OnConflictDeclared]: BaseEventPayload & {
        conflict: Conflict;
        type?: ConflictType;
        ring?: Ring;
        attackers?: DrawCard[];
        defenders?: DrawCard[];
        ringFate?: number;
    };
    [EventName.OnConflictDeclaredBeforeProvinceReveal]: BaseEventPayload & {
        conflict: Conflict;
        type?: ConflictType;
        ring?: Ring;
        attackers?: DrawCard[];
        ringFate?: number;
    };
    [EventName.OnTheCrashingWave]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnConflictStarted]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnConflictFinished]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnConflictPass]: BaseEventPayload & { conflict: Conflict; player?: Player };
    [EventName.OnCharacterEntersPlay]: BaseEventPayload & {
        card: DrawCard;
        player?: Player;
        originalLocation?: Location;
        fate?: number;
        status?: 'honored' | 'ordinary' | 'dishonored';
        controller?: Players;
        intoConflict?: boolean;
        side?: Player;
    };
    [EventName.OnCardRevealed]: BaseEventPayload & { card: BaseCard; onDeclaration?: boolean };
    [EventName.OnBreakProvince]: BaseEventPayload & {
        card: ProvinceCard;
        conflict: Conflict | null;
    };
    [EventName.OnCardLeavesPlay]: BaseEventPayload & {
        card: BaseCard;
        destination?: Location;
        cardStateWhenLeftPlay?: BaseCard;
        isSacrifice?: boolean;
        shuffle?: boolean;
        options?: { bottom?: boolean };
    };
    [EventName.OnCardHonored]: BaseEventPayload & { card: DrawCard; source?: BaseCard };
    [EventName.OnCardDishonored]: BaseEventPayload & { card: DrawCard };
    [EventName.OnCardBowed]: BaseEventPayload & { card: DrawCard };
    [EventName.OnCardReadied]: BaseEventPayload & { card: DrawCard };
    [EventName.OnCardMoved]: BaseEventPayload & {
        card: BaseCard;
        originalLocation: Location;
        newLocation: Location;
        shuffle?: boolean;
        bottom?: boolean;
        options?: { bottom?: boolean };
        amount?: number;
        cards?: BaseCard[];
        player?: Player;
        discardedCards?: BaseCard[];
    };
    [EventName.OnClaimRing]: BaseEventPayload & {
        player: Player;
        ring: Ring;
        conflict?: Conflict;
    };
    [EventName.OnPhaseStarted]: BaseEventPayload & { phase: Phases };
    [EventName.OnPhaseEnded]: BaseEventPayload & { phase: Phases };
    [EventName.OnInitiateAbilityEffects]: BaseEventPayload & {
        context: AbilityContext;
        card: BaseCard;
        cardTargets?: BaseCard[];
        ringTargets?: Ring[];
    };
    [EventName.OnMoveToConflict]: BaseEventPayload & { card: DrawCard; side?: Player };
    [EventName.OnDefendersDeclared]: BaseEventPayload & { conflict: Conflict; defenders?: DrawCard[] };
    [EventName.OnPassFirstPlayer]: BaseEventPayload & { player?: Player };
    [EventName.OnPassActionPhasePriority]: BaseEventPayload & {
        player: Player;
        consecutiveActions?: number;
        actionWindow?: ActionWindow;
    };
    [EventName.OnDeckShuffled]: BaseEventPayload & { player: Player; deck: Decks };
    [EventName.OnCardAttached]: BaseEventPayload & {
        card: BaseCard;
        parent: DrawCard | Ring;
        originalLocation?: Location;
    };
    [EventName.AfterDuel]: BaseEventPayload & {
        duel?: Duel;
        winner?: DrawCard[];
        loser?: DrawCard[];
        winningPlayer?: Player | Player[];
        losingPlayer?: Player | Player[];
    };
    [EventName.OnDuelFinished]: BaseEventPayload & { duel?: Duel };
    [EventName.OnAddDuelParticipant]: BaseEventPayload & { card: DrawCard; duel: Duel };
    [EventName.OnDuelChallenge]: BaseEventPayload & { duel?: Duel };
    [EventName.OnDuelFocus]: BaseEventPayload & { duel?: Duel };
    [EventName.OnDuelStrike]: BaseEventPayload & { duel?: Duel };
    [EventName.AfterConflict]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnMoveFate]: BaseEventPayload & {
        fate: number;
        amount?: number;
        origin?: Ring | BaseCard | Player;
        recipient?: Player | BaseCard | Ring;
        context?: AbilityContext;
    };
    [EventName.OnSpendFate]: BaseEventPayload & {
        amount: number;
        context: AbilityContext;
        recipient?: Player;
        fate?: number;
    };
    [EventName.OnFateCollected]: BaseEventPayload & { player: Player };
    [EventName.OnModifyFate]: BaseEventPayload & {
        player?: Player;
        card?: BaseCard;
        amount?: number;
    };
    [EventName.OnCardAbilityInitiated]: BaseEventPayload & {
        card: BaseCard;
        ability: BaseAbility;
        context: AbilityContext;
        player?: Player;
    };
    [EventName.OnCardAbilityTriggered]: BaseEventPayload & {
        player: Player;
        card: BaseCard;
        context: AbilityContext;
        ability?: BaseAbility;
    };
    [EventName.OnAbilityResolved]: BaseEventPayload & {
        card?: BaseCard;
        context?: AbilityContext;
        ability?: BaseAbility;
    };
    [EventName.OnReturnHome]: BaseEventPayload & {
        card: DrawCard;
        conflict?: Conflict;
        bowEvent?: Event;
    };
    [EventName.OnParticipantsReturnHome]: BaseEventPayload & {
        conflict: Conflict;
        returnHomeEvents?: Event[];
    };
    [EventName.OnCardsDrawn]: BaseEventPayload & {
        player: Player;
        amount: number;
        cards?: DrawCard[];
    };
    [EventName.OnCardsDiscarded]: BaseEventPayload & {
        player?: Player;
        cards?: BaseCard[];
        originalCardStateInfo?: { location: Location; owner: Player }[];
    };
    [EventName.OnCardsDiscardedFromHand]: BaseEventPayload & {
        player?: Player;
        cards?: BaseCard[];
        amount?: number;
        reveal?: boolean;
        match?: (context: AbilityContext, card: BaseCard) => boolean;
        discardedAtRandom?: boolean;
        discardedCards?: BaseCard[];
    };
    [EventName.OnAddTokenToCard]: BaseEventPayload & {
        card: BaseCard;
        token?: StatusToken;
        recipient?: BaseCard;
        tokenType?: TokenType;
    };
    [EventName.OnStatusTokenGained]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken | CharacterStatus;
        recipient?: BaseCard;
    };
    [EventName.OnStatusTokenMoved]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken;
        donor?: BaseCard;
        recipient?: DrawCard;
    };
    [EventName.OnStatusTokenDiscarded]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken;
        cards?: BaseCard[];
    };
    [EventName.OnEffectApplied]: BaseEventPayload & {
        effect?: unknown;
        context?: AbilityContext;
        card?: BaseCard;
        effectTypes?: string[];
        matches?: BaseCard[];
    };
    [EventName.OnLookAtCards]: BaseEventPayload & {
        player?: Player;
        cards?: BaseCard[];
        stateBeforeResolution?: { card: BaseCard; location: Location }[];
    };
    [EventName.OnDeckSearch]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        selectedCards?: BaseCard[];
    };
    [EventName.OnHonorBid]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        giveHonor?: boolean;
        prohibitedBids?: number[];
        players?: Players;
        postBidAction?: GameAction;
        message?: string;
        messageArgs?: (context: AbilityContext) => unknown[];
    };
    [EventName.OnModifyBid]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        direction?: Direction;
    };
    [EventName.OnModifyHonor]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        dueToUnopposed?: boolean;
        dueToStatusToken?: boolean;
    };
    [EventName.OnTransferHonor]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        afterBid?: boolean;
    };
    [EventName.OnResolveFateCost]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        context?: AbilityContext;
    };
    [EventName.OnDuelInitiated]: BaseEventPayload & {
        duel?: Duel;
        cards?: DrawCard[];
        duelType?: DuelType;
        challenger?: DrawCard;
        duelTarget?: BaseCard | BaseCard[];
    };
    [EventName.OnDuelStarted]: BaseEventPayload & { duel?: Duel };
    [EventName.OnDuelResolution]: BaseEventPayload & { duel?: Duel };
    [EventName.OnCardTainted]: BaseEventPayload & { card?: BaseCard };
    [EventName.OnCardTurnedFacedown]: BaseEventPayload & { card?: BaseCard };
    [EventName.OnDynastyCardTurnedFaceup]: BaseEventPayload & { card?: BaseCard };
    [EventName.OnRevealFacedownDynastyCards]: BaseEventPayload & { player?: Player };
    [EventName.OnRestoreProvince]: BaseEventPayload & { card?: ProvinceCard };
    [EventName.OnResolveConflictRing]: BaseEventPayload & {
        ring?: Ring;
        conflict?: Conflict;
        player?: Player;
    };
    [EventName.OnResolveRingElement]: BaseEventPayload & {
        element?: string;
        player?: Player;
        ring?: Ring;
        effectivellyResolvedEffect?: boolean;
        physicalRing?: Ring;
        optional?: boolean;
    };
    [EventName.OnRemoveRingFromPlay]: BaseEventPayload & { ring: Ring };
    [EventName.OnReturnRingToPlay]: BaseEventPayload & { ring: Ring };
    [EventName.OnReturnRing]: BaseEventPayload & { ring?: Ring };
    [EventName.OnCovertResolved]: BaseEventPayload & {
        card?: DrawCard;
        target?: DrawCard;
    };
    [EventName.OnConflictOpportunityAvailable]: BaseEventPayload & {
        player?: Player;
        attackerMatrix?: AttackersMatrix;
        type?: ConflictType;
    };
    [EventName.OnCreateTokenCharacter]: BaseEventPayload & {
        tokenCharacter?: DrawCard;
        card?: DrawCard;
    };
    [EventName.OnPlaceFateOnUnclaimedRings]: BaseEventPayload & {
        player?: Player;
        recipients?: { ring: Ring; amount: number }[];
    };
    [EventName.OnBeginRound]: BaseEventPayload & { round?: number };
    [EventName.OnRoundEnded]: BaseEventPayload & { round?: number };
    [EventName.OnFavorGloryTied]: BaseEventPayload;
    [EventName.OnHonorDialsRevealed]: BaseEventPayload & {
        player1?: Player;
        player2?: Player;
        isHonorBid?: boolean;
        duel?: Duel;
    };
    [EventName.OnPhaseCreated]: BaseEventPayload & { phase?: Phases };
    [EventName.OnPassDuringDynasty]: BaseEventPayload & { player?: Player; firstToPass?: boolean };
    [EventName.OnCardDetached]: BaseEventPayload & {
        card?: BaseCard;
        parent?: BaseCard;
    };
    [EventName.OnSendHome]: BaseEventPayload & { card?: DrawCard };
    [EventName.OnDiscardFavor]: BaseEventPayload & { player?: Player };
    [EventName.OnClaimFavor]: BaseEventPayload & { player?: Player };
    [EventName.OnConflictInitiated]: BaseEventPayload & { player: Player };
    [EventName.OnConflictMoved]: BaseEventPayload & { card: ProvinceCard };
    [EventName.OnFlipFavor]: BaseEventPayload & { player: Player };
    [EventName.OnGloryCount]: BaseEventPayload;
    [EventName.OnSetHonorDial]: BaseEventPayload & { player: Player; value: number };
    [EventName.OnSwitchConflictElement]: BaseEventPayload & { ring: Ring };
    [EventName.OnSwitchConflictType]: BaseEventPayload & { ring: Ring };
    [EventName.OnTakeRing]: BaseEventPayload & { ring: Ring };
}

export type EventPayload<K extends string> =
    K extends keyof EventPayloadMap ? EventPayloadMap[K] : BaseEventPayload & Record<string, unknown>;

// An event of a specific name, carrying its precise payload fields alongside the
// framework Event surface. Produced by the typed event factory.
export type GameEvent<N extends string = EventName> = Event & EventPayload<N>;

export type AllPayloadKeys = EventPayloadMap[keyof EventPayloadMap] extends infer P
    ? P extends object ? keyof P : never
    : never;

// The union of every value `K` can take across all payloads — used to type the
// fallback fields declared on the Event class.
export type PayloadValueAt<K extends PropertyKey> = EventPayloadMap[keyof EventPayloadMap] extends infer P
    ? P extends object ? (K extends keyof P ? P[K] : never) : never
    : never;

// All-fields-optional view, for typing an event whose specific name is not known
// at the use site (e.g. the triggering event on a TriggeredAbilityContext).
export type EventUnion = {
    [K in AllPayloadKeys]?: PayloadValueAt<K>;
};
