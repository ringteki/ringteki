import type { LobbyUser, UserIdentity, ShortCardData } from '../gamenode/LobbyProtocol.js';
import ChatCommands from './ChatCommands.js';
import { GameChat } from './GameChat.js';
import type { MsgArg } from './GameChat.js';
import { EffectEngine } from './EffectEngine.js';
import Player from './Player.js';
import type { ClockConfig } from './Clocks/ClockSelector.js';
import { Spectator } from './Spectator.js';
import { GamePipeline } from './GamePipeline.js';
import { SetupPhase } from './gamesteps/SetupPhase.js';
import { DynastyPhase } from './gamesteps/DynastyPhase.js';
import { DrawPhase } from './gamesteps/DrawPhase.js';
import { ConflictPhase } from './gamesteps/ConflictPhase.js';
import { FatePhase } from './gamesteps/FatePhase.js';
import { EndRoundPrompt } from './gamesteps/regroup/EndRoundPrompt.js';
import { SimpleStep } from './gamesteps/SimpleStep.js';
import GameWonPrompt from './gamesteps/GameWonPrompt.js';
import * as GameActions from './GameActions/GameActions.js';
import { Event } from './Events/Event.js';
import type { EventPayload, GameEvent } from './Events/EventPayloads.js';
import EventWindow from './Events/EventWindow.js';
import ThenEventWindow from './Events/ThenEventWindow.js';
import AbilityResolver from './gamesteps/AbilityResolver.js';
import SimultaneousEffectWindow from './gamesteps/SimultaneousEffectWindow.js';
import type { SimultaneousEffectChoiceInput } from './gamesteps/SimultaneousEffectWindow.js';
import type ForcedTriggeredAbilityWindow from './gamesteps/ForcedTriggeredAbilityWindow.js';
import type HonorBidPrompt from './gamesteps/HonorBidPrompt.js';
import type MenuPrompt from './gamesteps/MenuPrompt.js';
import type HandlerMenuPrompt from './gamesteps/HandlerMenuPrompt.js';
import type SelectCardPrompt from './gamesteps/SelectCardPrompt.js';
import type SelectRingPrompt from './gamesteps/SelectRingPrompt.js';
import type ActionWindow from './gamesteps/ActionWindow.js';
import { AbilityContext } from './AbilityContext.js';
import Ring from './Ring.js';
import { Conflict } from './Conflict.js';
import { Duel } from './Duel.js';
import ConflictFlow from './gamesteps/conflict/ConflictFlow.js';
import { GameInputHandler } from './GameInputHandler.js';
import { GameStateSerializer } from './GameStateSerializer.js';
import type { DeckForSaving, FormattedDeck } from './GameStateSerializer.js';
import type { MenuItem } from './MenuCommands.js';
import type { Step } from './gamesteps/Step.js';
import { GameEventManager } from './GameEventManager.js';
import { GameConnectionManager } from './GameConnectionManager.js';
import SpiritOfTheRiver from './cards/SpiritOfTheRiver.js';

import { EffectName, EventName, Location, ConflictType, Element, Players } from './Constants.js';
import { ConflictTracker, type ConflictRecord } from './ConflictTracker.js';
import { type EventHandler } from './GameEventBus.js';
import { GamePromptHelper } from './GamePromptHelper.js';
import { GameModes } from '../GameModes.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Socket from '../Socket.js';
import type { AnimationEvent } from './AnimationEvent.js';
import type { GameRouter } from './GameRouter.js';
import type { GameSaveState, GameSummary } from '../gamenode/LobbyProtocol.js';
import type { PlayerState, GamePlayerUser } from './Player.js';

export interface SharedGameState {
    [key: string]: unknown;
}

export interface GameState {
    players: Record<string, PlayerState>;
    rings: Record<string, unknown>;
    messages: unknown[];
    [key: string]: unknown;
}

export interface GameDetails {
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch: boolean;
    owner: string;
    savedGameId?: string;
    gameType: string;
    gameMode: string;
    password?: string;
    players: Record<string, GamePlayerEntry>;
    spectators: Record<string, GamePlayerEntry>;
    clocks: unknown;
}

interface GamePlayerEntry {
    id: string;
    user: GamePlayerUser;
}

interface GameOptions {
    shortCardData?: ShortCardData[];
    cardLibrary?: Map<string, unknown>;
    router?: GameRouter;
}

type ApplyGameActionCardTarget = BaseCard | BaseCard[];
type ApplyGameActionPlayerTarget = Player | Player[];

/*
 * The game actions reachable through `applyGameAction`, keyed by the name callers pass.
 * Each entry adapts the caller's bare target to that action's own properties type, so
 * the lookup stays typed instead of indexing the `GameActions` namespace dynamically.
 */
const APPLY_CARD_ACTIONS = {
    bow: (target: ApplyGameActionCardTarget) => GameActions.bow({ target }),
    break: (target: ApplyGameActionCardTarget) => GameActions.breakProvince({ target }),
    discardCard: (target: ApplyGameActionCardTarget) => GameActions.discardCard({ target }),
    discardFromPlay: (target: ApplyGameActionCardTarget) => GameActions.discardFromPlay({ target }),
    dishonor: (target: ApplyGameActionCardTarget) => GameActions.dishonor({ target }),
    flipDynasty: (target: ApplyGameActionCardTarget) => GameActions.flipDynasty({ target }),
    honor: (target: ApplyGameActionCardTarget) => GameActions.honor({ target }),
    placeFate: (target: ApplyGameActionCardTarget) => GameActions.placeFate({ target }),
    ready: (target: ApplyGameActionCardTarget) => GameActions.ready({ target }),
    removeFate: (target: ApplyGameActionCardTarget) => GameActions.removeFate({ target }),
    sendHome: (target: ApplyGameActionCardTarget) => GameActions.sendHome({ target }),
    turnFacedown: (target: ApplyGameActionCardTarget) => GameActions.turnFacedown({ target })
};

const APPLY_PLAYER_ACTIONS = {
    discardAtRandom: (target: ApplyGameActionPlayerTarget) => GameActions.discardAtRandom({ target }),
    draw: (target: ApplyGameActionPlayerTarget) => GameActions.draw({ target }),
    gainFate: (target: ApplyGameActionPlayerTarget) => GameActions.gainFate({ target }),
    gainHonor: (target: ApplyGameActionPlayerTarget) => GameActions.gainHonor({ target }),
    loseHonor: (target: ApplyGameActionPlayerTarget) => GameActions.loseHonor({ target })
};

export type GameActionRequest = Partial<
    { [K in keyof typeof APPLY_CARD_ACTIONS]: ApplyGameActionCardTarget } &
    { [K in keyof typeof APPLY_PLAYER_ACTIONS]: ApplyGameActionPlayerTarget }
>;

class Game {
    private readonly events = new GameEventManager(this);

    effectEngine: EffectEngine;
    playersAndSpectators: Record<string, Player | Spectator>;
    gameChat: GameChat;
    chatCommands: ChatCommands;
    pipeline: GamePipeline;
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch: boolean;
    owner: string;
    started: boolean;
    playStarted: boolean;
    createdAt: Date;
    savedGameId?: string;
    gameType: string;
    currentAbilityWindow: ForcedTriggeredAbilityWindow | SimultaneousEffectWindow | null;
    currentActionWindow: ActionWindow | null;
    currentEventWindow: EventWindow | null;
    currentConflict: Conflict | null;
    currentDuel: Duel | null;
    manualMode: boolean;
    gameMode: string;
    currentPhase: string;
    password?: string;
    roundNumber: number;
    initialFirstPlayer: string | null;
    private conflictTracker: ConflictTracker;
    readonly prompts: GamePromptHelper;
    private readonly input: GameInputHandler;
    private readonly serializer: GameStateSerializer;
    private readonly connections: GameConnectionManager;
    rings: Record<string, Ring>;
    shortCardData: ShortCardData[];
    cardLibrary: Map<string, unknown>;
    router?: GameRouter;
    allCards: BaseCard[];
    private cardsByUuid = new Map<string, BaseCard>();
    provinceCards: BaseCard[];
    winner?: Player;
    finishedAt?: Date;
    winReason?: string;
    hiddenInfoLog: Record<string, unknown>[];
    startedAt?: Date;
    private _playersCache: Player[] | null = null;
    private _spectatorsCache: Spectator[] | null = null;
    pendingAnimations: AnimationEvent[] = [];

    constructor(details: GameDetails, options: GameOptions = {}) {
        this.effectEngine = new EffectEngine(this);
        this.playersAndSpectators = {};
        this.gameChat = new GameChat();
        this.chatCommands = new ChatCommands(this);
        this.pipeline = new GamePipeline();
        this.id = details.id;
        this.name = details.name;
        this.allowSpectators = details.allowSpectators;
        this.spectatorSquelch = details.spectatorSquelch;
        this.owner = details.owner;
        this.started = false;
        this.playStarted = false;
        this.createdAt = new Date();
        this.savedGameId = details.savedGameId;
        this.gameType = details.gameType;
        this.currentAbilityWindow = null;
        this.currentActionWindow = null;
        this.currentEventWindow = null;
        this.currentConflict = null;
        this.currentDuel = null;
        this.manualMode = false;
        this.gameMode = details.gameMode;
        this.currentPhase = '';
        this.password = details.password;
        this.roundNumber = 0;
        this.initialFirstPlayer = null;

        this.conflictTracker = new ConflictTracker();
        this.prompts = new GamePromptHelper(this);
        this.input = new GameInputHandler(this);
        this.serializer = new GameStateSerializer(this);
        this.connections = new GameConnectionManager(this);
        this.rings = {
            air: new Ring(this, Element.Air, ConflictType.Military),
            earth: new Ring(this, Element.Earth, ConflictType.Political),
            fire: new Ring(this, Element.Fire, ConflictType.Military),
            void: new Ring(this, Element.Void, ConflictType.Political),
            water: new Ring(this, Element.Water, ConflictType.Military)
        };
        this.shortCardData = options.shortCardData || [];
        this.cardLibrary = options.cardLibrary ?? new Map();
        this.allCards = [];
        this.provinceCards = [];
        this.hiddenInfoLog = [];

        Object.values(details.players).forEach((player: { id: string; user: GamePlayerUser }) => {
            this.playersAndSpectators[player.user.username] = new Player(
                player.id,
                player.user,
                this.owner === player.user.username,
                this,
                details.clocks as ClockConfig | undefined
            );
        });

        Object.values(details.spectators).forEach((spectator: { id: string; user: GamePlayerUser }) => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.router = options.router;
    }

    get conflictRecord(): ConflictRecord[] {
        return this.conflictTracker.records;
    }

    set conflictRecord(records: ConflictRecord[]) {
        this.conflictTracker.records = records;
    }

    /*
     * Reports errors from the game engine back to the router
     */
    reportError(e: Error): void {
        this.router?.handleError(this, e);
    }

    addAnimation(event: AnimationEvent): void {
        this.pendingAnimations.push(event);
    }

    clearAnimations(): void {
        this.pendingAnimations = [];
    }

    /**
     * Adds a message to the in-game chat e.g 'Jadiel draws 1 card'
     */
    addMessage(message: string, ...args: MsgArg[]): void {
        this.gameChat.addMessage(message, ...args);
    }

    /**
     * Adds a message to in-game chat with a graphical icon
     */
    addAlert(type: string, message: string, ...args: MsgArg[]): void {
        this.gameChat.addAlert(type, message, ...args);
    }

    get messages(): GameChat['messages'] {
        return this.gameChat.messages;
    }

    /**
     * Checks if a player is a spectator
     */
    isSpectator(player: Player | Spectator): boolean {
        return player.constructor === Spectator;
    }

    invalidatePlayerCaches(): void {
        this._playersCache = null;
        this._spectatorsCache = null;
    }

    /**
     * Checks whether a player/spectator is still in the game
     */
    hasActivePlayer(playerName: string): boolean {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    /**
     * Get all players (not spectators) in the game
     */
    getPlayers(): Player[] {
        if(!this._playersCache) {
            this._playersCache = Object.values(this.playersAndSpectators).filter((player) => !this.isSpectator(player)) as Player[];
        }
        return this._playersCache;
    }

    /**
     * Returns the Player object (not spectator) for a name
     */
    getPlayerByName(playerName: string): Player | undefined {
        const player = this.playersAndSpectators[playerName];
        if(player && !this.isSpectator(player)) {
            return player as Player;
        }
        return undefined;
    }

    /**
     * Get all players (not spectators) with the first player at index 0
     */
    getPlayersInFirstPlayerOrder(): Player[] {
        return this.getPlayers().sort((a) => (a.firstPlayer ? -1 : 1));
    }

    /**
     * Get all players and spectators in the game
     */
    getPlayersAndSpectators(): Record<string, Player | Spectator> {
        return this.playersAndSpectators;
    }

    /**
     * Get all spectators in the game
     */
    getSpectators(): Spectator[] {
        if(!this._spectatorsCache) {
            this._spectatorsCache = Object.values(this.playersAndSpectators).filter((player) => this.isSpectator(player)) as Spectator[];
        }
        return this._spectatorsCache;
    }

    /**
     * Gets the current First Player
     */
    getFirstPlayer(): Player | undefined {
        return this.getPlayers().find((p) => p.firstPlayer);
    }

    /**
     * Gets a player other than the one passed (usually their opponent)
     */
    getOtherPlayer(player: Player): Player | undefined {
        return this.getPlayers().find((p) => {
            return p.name !== player.name;
        });
    }

    /**
     * Returns the card (i.e. character) with matching uuid from either players
     * 'in play' area.
     */
    findAnyCardInPlayByUuid(cardId: string): DrawCard | null {
        return this.getPlayers().reduce((card: DrawCard | null, player: Player) => {
            if(card) {
                return card;
            }
            return player.findCardInPlayByUuid(cardId);
        }, null);
    }

    /**
     * Identity lookup only: returns the card object with this uuid for the game's
     * lifetime. uuids are never reused, but entries are never pruned either, so a
     * created token that has since left the game is still returned here. Callers must
     * re-check `location`/ownership rather than treating a hit as "still in play".
     */
    findAnyCardInAnyList(cardId: string): BaseCard | undefined {
        return this.cardsByUuid.get(cardId);
    }

    /**
     * Returns all cards from anywhere in the game matching the passed predicate
     */
    findAnyCardsInAnyList(predicate: (card: BaseCard) => boolean): BaseCard[] {
        return this.allCards.filter(predicate);
    }

    /**
     * Returns all cards (i.e. characters) which matching the passed predicated
     * function from either players 'in play' area.
     */
    findAnyCardsInPlay(predicate: (card: DrawCard) => boolean): DrawCard[] {
        let foundCards: DrawCard[] = [];

        this.getPlayers().forEach((player) => {
            foundCards = foundCards.concat(player.findCards(player.cardsInPlay, predicate as (card: BaseCard) => boolean) as DrawCard[]);
        });

        return foundCards;
    }

    /**
     * Returns if a card is in play (characters, attachments, provinces, holdings) that has the passed trait
     */
    isTraitInPlay(trait: string): boolean {
        return this.getPlayers().some((player) => player.isTraitInPlay(trait));
    }

    getProvinceArray(includeStronghold: boolean = true): Location[] {
        if(this.gameMode === GameModes.Skirmish) {
            return [Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree];
        }
        let array: Location[] = [
            Location.ProvinceOne,
            Location.ProvinceTwo,
            Location.ProvinceThree,
            Location.ProvinceFour
        ];
        if(includeStronghold) {
            array.push(Location.StrongholdProvince);
        }
        return array;
    }

    createToken(card: DrawCard, token?: new (card: DrawCard) => DrawCard): DrawCard {
        let tokenCard: DrawCard;
        if(!token) {
            tokenCard = new SpiritOfTheRiver(card);
        } else {
            tokenCard = new token(card);
        }
        this.allCards.push(tokenCard);
        this.cardsByUuid.set(tokenCard.uuid, tokenCard);
        return tokenCard;
    }

    get actions(): typeof GameActions {
        return GameActions;
    }

    isDuringConflict(types: string | string[] | null = null): boolean {
        const conflict = this.currentConflict;
        if(!conflict) {
            return false;
        } else if(!types) {
            return true;
        } else if(!Array.isArray(types)) {
            types = [types];
        }
        const elementsAndType = ([...conflict.elements, conflict.conflictType] as Array<string | undefined>).filter(
            (value): value is string => typeof value === 'string'
        );
        return types.every((type) => elementsAndType.includes(type));
    }

    recordConflict(conflict: Conflict): void {
        this.conflictTracker.record(conflict);
    }

    getConflicts(player: Player | Players.All): ConflictRecord[] {
        return this.conflictTracker.getForPlayer(player);
    }

    recordConflictWinner(conflict: Conflict): void {
        this.conflictTracker.recordWinner(conflict);
    }

    stopNonChessClocks(): void {
        this.getPlayers().forEach((player) => player.stopNonChessClocks());
    }

    stopClocks(): void {
        this.getPlayers().forEach((player) => player.stopClock());
    }

    resetClocks(): void {
        this.getPlayers().forEach((player) => player.resetClock());
    }

    /**
     * This function is called from the client whenever a card is clicked
     */
    cardClicked(sourcePlayer: string, cardId: string): void {
        this.input.cardClicked(sourcePlayer, cardId);
    }

    facedownCardClicked(
        playerName: string,
        location: string,
        controllerName: string,
        isProvince: boolean = false
    ): void {
        this.input.facedownCardClicked(playerName, location, controllerName, isProvince);
    }

    ringClicked(sourcePlayer: string, ringindex: string): void {
        this.input.ringClicked(sourcePlayer, ringindex);
    }

    menuItemClick(sourcePlayer: string, cardId: string, menuItem: MenuItem): void {
        this.input.menuItemClick(sourcePlayer, cardId, menuItem);
    }

    ringMenuItemClick(sourcePlayer: string, sourceRing: { element: string }, menuItem: MenuItem): void {
        this.input.ringMenuItemClick(sourcePlayer, sourceRing, menuItem);
    }

    showConflictDeck(playerName: string): void {
        this.input.showConflictDeck(playerName);
    }

    showDynastyDeck(playerName: string): void {
        this.input.showDynastyDeck(playerName);
    }

    drop(playerName: string, cardId: string, source: string, target: string): void {
        this.input.drop(playerName, cardId, source, target);
    }

    /**
     * Check to see if either player has won/lost the game due to honor (NB: this
     * function doesn't check to see if a conquest victory has been achieved)
     */
    checkWinCondition(): void {
        const honorRequiredToWin = this.gameMode === GameModes.Skirmish ? 12 : 25;
        for(const player of this.getPlayersInFirstPlayerOrder()) {
            if(player.honor >= honorRequiredToWin) {
                this.recordWinner(player, 'honor');
            } else if(player.opponent && player.opponent.honor <= 0) {
                this.recordWinner(player, 'dishonor');
            }
        }
    }

    /**
     * Display message declaring victory for one player, and record stats for
     * the game
     */
    recordWinner(winner: Player, reason: string): void {
        if(this.winner) {
            return;
        }

        this.addMessage('{0} has won the game', winner);

        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router?.gameWon(this, reason, winner);

        this.queueStep(new GameWonPrompt(this, winner));
    }

    /**
     * Designate a player as First Player
     */
    setFirstPlayer(firstPlayer: Player): void {
        if(!this.initialFirstPlayer) {
            this.initialFirstPlayer = firstPlayer.name;
        }
        for(const player of this.getPlayers()) {
            if(player === firstPlayer) {
                player.firstPlayer = true;
            } else {
                player.firstPlayer = false;
            }
        }
    }

    /**
     * Changes a Player variable and displays a message in chat
     */
    changeStat(playerName: string, stat: string, value: number): void {
        this.input.changeStat(playerName, stat, value);
    }

    /**
     * This function is called by the client every time a player enters a chat message
     */
    chat(playerName: string, message: string): void {
        this.input.chat(playerName, message);
    }

    /**
     * This is called by the client when a player clicks 'Concede'
     */
    concede(playerName: string): void {
        this.input.concede(playerName);
    }

    selectDeck(playerName: string, deck: unknown): void {
        this.input.selectDeck(playerName, deck);
    }

    shuffleConflictDeck(playerName: string): void {
        this.input.shuffleConflictDeck(playerName);
    }

    shuffleDynastyDeck(playerName: string): void {
        this.input.shuffleDynastyDeck(playerName);
    }

    promptWithMenu(player: Player, contextObj: ConstructorParameters<typeof MenuPrompt>[2], properties: ConstructorParameters<typeof MenuPrompt>[3]): void {
        this.prompts.promptWithMenu(player, contextObj, properties);
    }

    promptWithHandlerMenu(player: Player, properties: ConstructorParameters<typeof HandlerMenuPrompt>[2]): void {
        this.prompts.promptWithHandlerMenu(player, properties);
    }

    promptForSelect(player: Player, properties: ConstructorParameters<typeof SelectCardPrompt>[2]): void {
        this.prompts.promptForSelect(player, properties);
    }

    promptForRingSelect(player: Player, properties: ConstructorParameters<typeof SelectRingPrompt>[2]): void {
        this.prompts.promptForRingSelect(player, properties);
    }

    promptForHonorBid(activePromptTitle: string, costHandler?: ConstructorParameters<typeof HonorBidPrompt>[2], prohibitedBids?: ConstructorParameters<typeof HonorBidPrompt>[3], duel: ConstructorParameters<typeof HonorBidPrompt>[4] = null): void {
        this.prompts.promptForHonorBid(activePromptTitle, costHandler, prohibitedBids, duel);
    }

    /**
     * This function is called by the client whenever a player clicks a button
     * in a prompt
     */
    menuButton(playerName: string, arg: string, uuid: string, method: string): boolean {
        return this.input.menuButton(playerName, arg, uuid, method);
    }

    togglePromptedActionWindow(playerName: string, windowName: string, toggle: boolean): void {
        this.input.togglePromptedActionWindow(playerName, windowName, toggle);
    }

    toggleTimerSetting(playerName: string, settingName: string, toggle: boolean): void {
        this.input.toggleTimerSetting(playerName, settingName, toggle);
    }

    toggleOptionSetting(playerName: string, settingName: string, toggle: boolean): void {
        this.input.toggleOptionSetting(playerName, settingName, toggle);
    }

    toggleManualMode(playerName: string): void {
        this.input.toggleManualMode(playerName);
    }

    /*
     * Sets up Player objects, creates allCards, checks each player has a stronghold
     * and starts the game pipeline
     */
    initialise(): boolean | void {
        const players: Record<string, Player | Spectator> = {};

        Object.values(this.playersAndSpectators).forEach((player) => {
            if(!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        let playerWithNoStronghold: Player | null = null;

        for(const player of this.getPlayers()) {
            player.initialise();
            if(this.gameMode !== GameModes.Skirmish && !player.stronghold) {
                playerWithNoStronghold = player;
            }
        }

        this.allCards = this.getPlayers().reduce((cards: BaseCard[], player: Player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []);
        this.cardsByUuid.clear();
        for(const card of this.allCards) {
            this.cardsByUuid.set(card.uuid, card);
        }
        this.provinceCards = this.allCards.filter((card) => card.isProvince);

        if(this.gameMode !== GameModes.Skirmish) {
            if(playerWithNoStronghold) {
                this.queueSimpleStep(() => {
                    this.addMessage(
                        'Invalid Deck Detected: {0} does not have a stronghold in their decklist',
                        playerWithNoStronghold
                    );
                    return false;
                });
                this.continue();
                return false;
            }

            for(const player of this.getPlayers()) {
                const numProvinces = this.provinceCards.filter((a) => a.controller === player);
                if(numProvinces.length !== 5) {
                    this.queueSimpleStep(() => {
                        this.addMessage('Invalid Deck Detected: {0} has {1} provinces', player, numProvinces.length);
                        return false;
                    });
                    this.continue();
                    return false;
                }
            }
        }

        this.pipeline.initialise([new SetupPhase(this), new SimpleStep(this, () => this.beginRound())]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.continue();
    }

    /*
     * Adds each of the game's main phases to the pipeline
     */
    beginRound(): void {
        this.resetLimitedForPlayer();
        this.roundNumber++;
        this.raiseEvent(EventName.OnBeginRound);
        this.queueStep(new DynastyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new ConflictPhase(this));
        this.queueStep(new FatePhase(this));
        this.queueStep(new EndRoundPrompt(this));
        this.queueStep(new SimpleStep(this, () => this.roundEnded()));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    roundEnded(): void {
        this.raiseEvent(EventName.OnRoundEnded);
    }

    resetLimitedForPlayer(): void {
        const players = this.getPlayers();
        players.forEach((player) => {
            player.limitedPlayed = 0;
        });
    }

    /*
     * Adds a step to the pipeline queue
     */
    queueStep<T extends Step>(step: T): T {
        this.pipeline.queueStep(step);
        return step;
    }

    /*
     * Creates a step which calls a handler function
     */
    queueSimpleStep(handler: () => unknown): void {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    /*
     * Resolves a card ability or ring effect
     */
    resolveAbility(context: AbilityContext): AbilityResolver {
        const resolver = new AbilityResolver(this, context);
        this.queueStep(resolver);
        return resolver;
    }

    openSimultaneousEffectWindow(choices: SimultaneousEffectChoiceInput[]): void {
        const window = new SimultaneousEffectWindow(this);
        choices.forEach((choice) => window.addChoice(choice));
        this.queueStep(window);
    }

    getEvent<N extends EventName>(eventName: N, params?: EventPayload<N>, handler?: (event: GameEvent<N>) => void): GameEvent<N>;
    getEvent(eventName: string, params?: Record<string, unknown>, handler?: (event: Event) => void): Event;
    getEvent(eventName: string, params: Record<string, unknown> = {}, handler?: (event: Event) => void): Event {
        return this.events.getEvent(eventName, params, handler);
    }

    /**
     * Creates a game Event, and opens a window for it.
     */
    raiseEvent<N extends EventName>(eventName: N, params?: EventPayload<N>, handler?: (event: GameEvent<N>) => void): GameEvent<N>;
    raiseEvent(eventName: string, params?: Record<string, unknown>, handler?: (event: Event) => void): Event;
    raiseEvent(eventName: string, params: Record<string, unknown> = {}, handler: (event: Event) => void = () => true): Event {
        return this.events.raiseEvent(eventName, params, handler);
    }

    emitEvent(eventName: string, params: Record<string, unknown> = {}): void {
        this.events.emitEvent(eventName, params);
    }

    emit(eventName: string, ...args: unknown[]): void {
        this.events.emit(eventName, ...args);
    }

    on(eventName: string, handler: EventHandler): void {
        this.events.on(eventName, handler);
    }

    once(eventName: string, handler: EventHandler): void {
        this.events.once(eventName, handler);
    }

    removeListener(eventName: string, handler: EventHandler): void {
        this.events.removeListener(eventName, handler);
    }

    /**
     * Creates an EventWindow which will open windows for each kind of triggered
     * ability which can respond any passed events, and execute their handlers.
     */
    openEventWindow(events: Event | Event[]): EventWindow {
        return this.events.openEventWindow(events);
    }

    openThenEventWindow(events: Event | Event[]): EventWindow | ThenEventWindow {
        return this.events.openThenEventWindow(events);
    }

    /**
     * Raises a custom event window for checking for any cancels to a card
     * ability
     */
    raiseInitiateAbilityEvent(params: Record<string, unknown>, handler: () => void): void {
        this.events.raiseInitiateAbilityEvent(params, handler);
    }

    /**
     * Raises a custom event window for checking for any cancels to several card
     * abilities which initiate simultaneously
     */
    raiseMultipleInitiateAbilityEvents(eventProps: Array<{ params: Record<string, unknown>; handler: () => void }>): void {
        this.events.raiseMultipleInitiateAbilityEvents(eventProps);
    }

    /**
     * Checks whether a game action can be performed on a card or an array of
     * cards, and performs it on all legal targets.
     */
    applyGameAction(context: AbilityContext | null, actions: GameActionRequest): Event[] {
        if(!context) {
            context = this.getFrameworkContext();
        }
        const resolvedContext = context;
        const actionPairs = Object.entries(actions);
        const events = actionPairs.reduce((array: Event[], [action, cards]) => {
            if(action in APPLY_CARD_ACTIONS) {
                const factory = APPLY_CARD_ACTIONS[action as keyof typeof APPLY_CARD_ACTIONS];
                factory(cards as ApplyGameActionCardTarget).addEventsToArray(array, resolvedContext);
            } else if(action in APPLY_PLAYER_ACTIONS) {
                const factory = APPLY_PLAYER_ACTIONS[action as keyof typeof APPLY_PLAYER_ACTIONS];
                factory(cards as ApplyGameActionPlayerTarget).addEventsToArray(array, resolvedContext);
            }
            return array;
        }, []);
        if(events.length > 0) {
            this.openEventWindow(events);
            this.queueSimpleStep(() => resolvedContext.refill());
        }
        return events;
    }

    getFrameworkContext(player: Player | null = null): AbilityContext {
        return new AbilityContext({ game: this, player: player ?? undefined });
    }

    initiateConflict(
        player: Player,
        canPass: boolean,
        forcedDeclaredType?: ConflictType,
        forceProvinceTarget?: ProvinceCard
    ): void {
        const conflict = new Conflict(
            this,
            player,
            player.opponent as Player,
            undefined,
            forceProvinceTarget ?? undefined,
            forcedDeclaredType
        );
        this.queueStep(new ConflictFlow(this, conflict, canPass));
    }

    updateCurrentConflict(conflict: Conflict | null): void {
        this.currentConflict = conflict;
        this.checkGameState(true);
    }

    /**
     * Changes the controller of a card in play to the passed player, and cleans
     * all the related stuff up (swapping sides in a conflict)
     */
    takeControl(player: Player, card: DrawCard): void {
        if(
            card.controller === player ||
            !card.checkRestrictions(EffectName.TakeControl, this.getFrameworkContext())
        ) {
            return;
        }
        if(!player || !player.cardsInPlay) {
            return;
        }
        card.controller.removeCardFromPile(card);
        player.cardsInPlay.push(card);
        card.controller = player;
        if(card.isParticipating() && this.currentConflict) {
            this.currentConflict.removeFromConflict(card);
            if(player.isAttackingPlayer()) {
                this.currentConflict.addAttacker(card);
            } else {
                this.currentConflict.addDefender(card);
            }
        }
        card.updateEffectContexts();
        this.checkGameState(true);
    }

    getFavorSide(): string | undefined {
        for(const player of this.getPlayers()) {
            if(player.imperialFavor) {
                return player.imperialFavor;
            }
        }
        return undefined;
    }

    watch(socketId: string, user: UserIdentity): boolean {
        return this.connections.watch(socketId, user);
    }

    join(socketId: string, user: LobbyUser): boolean {
        return this.connections.join(socketId, user);
    }

    isEmpty(): boolean {
        return this.connections.isEmpty();
    }

    allPlayersGone(): boolean {
        return this.connections.allPlayersGone();
    }

    leave(playerName: string): void {
        this.connections.leave(playerName);
    }

    disconnect(playerName: string): void {
        this.connections.disconnect(playerName);
    }

    failedConnect(playerName: string): void {
        this.connections.failedConnect(playerName);
    }

    reconnect(socket: Socket, playerName: string): void {
        this.connections.reconnect(socket, playerName);
    }

    checkGameState(hasChanged: boolean = false, events: Event[] = []): void {
        // check for a game state change (recalculating conflict skill if necessary)
        if(
            (!this.currentConflict && this.effectEngine.checkEffects(hasChanged)) ||
            (this.currentConflict && this.currentConflict.calculateSkill(hasChanged)) ||
            hasChanged
        ) {
            this.checkWinCondition();
            // if the state has changed, check for:
            for(const player of this.getPlayers()) {
                player.cardsInPlay.forEach((card: DrawCard) => {
                    if(card.getModifiedController() !== player) {
                        // any card being controlled by the wrong player
                        this.takeControl(card.getModifiedController(), card);
                    }
                    // any attachments which are illegally attached
                    if(!card.checkForIllegalAttachments()) {
                        // queue in a separate gamestate check
                        // any tokens which are illegal
                        card.checkForIllegalTokens();
                    }
                });
                player.getProvinces().forEach((card) => {
                    if(card) {
                        card.checkForIllegalAttachments();
                    }
                });

                if(!player.checkRestrictions('haveImperialFavor') && player.imperialFavor !== '') {
                    this.addMessage('The imperial favor is discarded as {0} cannot have it', player.name);
                    player.loseImperialFavor();
                }
            }
            if(this.currentConflict) {
                // conflicts with illegal participants
                this.currentConflict.checkForIllegalParticipants();
            }
        }
        if(events.length > 0) {
            // check for any delayed effects which need to fire
            this.effectEngine.checkDelayedEffects(events);
        }
    }

    continue(): void {
        this.pipeline.continue();
    }

    formatDeckForSaving(deck: DeckForSaving): FormattedDeck {
        return this.serializer.formatDeckForSaving(deck);
    }

    /*
     * This information is all logged when a game is won
     */
    getSaveState(): GameSaveState {
        return this.serializer.getSaveState();
    }

    /**
     * Pre-compute state shared across all viewers (conflict, messages, spectators, metadata).
     * Pass the result to getState() to avoid redundant work when sending to multiple clients.
     */
    getSharedState(): SharedGameState | null {
        return this.serializer.getSharedState();
    }

    getState(activePlayerName?: string, sharedState?: SharedGameState | null): GameState | GameSummary | undefined {
        return this.serializer.getState(activePlayerName, sharedState);
    }

    /**
     * Build a snapshot of hidden card identities (hands + facedown provinces) for replay enrichment.
     * Called each time game state is sent so the log can be merged into the client replay at game end.
     */
    getHiddenInfoFingerprint(): string {
        return this.serializer.getHiddenInfoFingerprint();
    }

    recordHiddenInfoIfChanged(): void {
        this.serializer.recordHiddenInfoIfChanged();
    }

    getHiddenInfo(): Record<string, unknown> {
        return this.serializer.getHiddenInfo();
    }

    getSummary(activePlayerName?: string): GameSummary | undefined {
        return this.serializer.getSummary(activePlayerName);
    }
}

export default Game;
