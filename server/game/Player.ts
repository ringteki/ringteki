import { shuffle } from './utils/shuffle.js';
import { HonorTracker } from './HonorTracker.js';
import { PlayerZones, type AdditionalPile } from './PlayerZones.js';

import { GameObject } from './GameObject.js';
import { Deck } from './Deck.js';
import AttachmentPrompt from './gamesteps/AttachmentPrompt.js';
import { clockFor, type ClockConfig } from './Clocks/ClockSelector.js';
import { CostReducer, type CostReducerProps } from './CostReducer.js';
import type { AbilityLimit } from './AbilityLimit.js';
import * as GameActions from './GameActions/GameActions.js';
import { RingEffects } from './RingEffects.js';
import { PlayableLocation } from './PlayableLocation.js';
import { PlayerCostManager } from './PlayerCostManager.js';
import { PlayerConflictManager, type ConflictDeclarationProperties } from './PlayerConflictManager.js';
import { PlayerStateBuilder } from './PlayerStateBuilder.js';
import { PlayerPromptState } from './PlayerPromptState.js';
import { RoleCard } from './RoleCard.js';
import { StrongholdCard } from './StrongholdCard.js';

import {
    CardType,
    ConflictType,
    Decks,
    EffectName,
    EventName,
    FavorType,
    Location,
    Players,
    PlayType
} from './Constants.js';
import { GameModes } from '../GameModes.js';
import type Game from './Game.js';
import type Socket from '../Socket.js';
import type BaseCard from './BaseCard.js';
import type { CardSummary } from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Ring from './Ring.js';
import type { ClockInterface } from './Clocks/types.js';
import type { AbilityContext } from './AbilityContext.js';
import type { DeckDTO } from '../gamenode/LobbyProtocol.js';
import type { FatePool } from './Effects/EffectValueMap.js';
import type { CardData } from './types/CardData.js';

export interface PlayerState extends Partial<ReturnType<PlayerPromptState['getState']>> {
    cardPiles: { [pile: string]: CardSummary[] };
    cardsPlayedThisConflict: number;
    disconnected: boolean;
    faction: DeckFaction;
    firstPlayer: boolean;
    hideProvinceDeck: boolean;
    id: string;
    imperialFavor: string;
    left: boolean;
    name: string;
    numConflictCards: number;
    numDynastyCards: number;
    numProvinceCards: number;
    optionSettings: OptionSettings;
    phase: string;
    promptedActionWindows: Record<string, boolean>;
    provinces: { one: CardSummary[]; two: CardSummary[]; three: CardSummary[]; four: CardSummary[] };
    showBid: number;
    stats: ReturnType<PlayerStateBuilder['getStats']>;
    timerSettings: TimerSettings;
    strongholdProvince: CardSummary[];
    user: {
        username: string;
        emailHash?: string;
        settings?: GamePlayerUserSettings;
    };
    showConflictDeck?: boolean;
    showDynastyDeck?: boolean;
    role?: CardSummary;
    stronghold?: CardSummary;
    conflictDeckTopCard?: CardSummary | ({ facedown: true } & ReturnType<PlayerPromptState['getCardSelectionState']>);
    dynastyDeckTopCard?: CardSummary | ({ facedown: true } & ReturnType<PlayerPromptState['getCardSelectionState']>);
    clock?: ReturnType<ClockInterface['getState']>;
}

export interface OptionSettings {
    markCardsUnselectable?: boolean;
    cancelOwnAbilities?: boolean;
    orderForcedAbilities?: boolean;
    confirmOneClick?: boolean;
    disableCardStats?: boolean;
    showStatusInSidebar?: boolean;
    sortHandByName?: boolean;
    showRingEffects?: boolean;
    [key: string]: boolean | undefined;
}

export interface TimerSettings {
    events?: boolean;
    eventsInDeck?: boolean;
    windowTimer?: number;
    [key: string]: boolean | number | undefined;
}

export interface DeckFaction {
    name?: string;
    value?: string;
}

export interface MoveCardOptions {
    bottom?: boolean;
}

export interface PatronSettings {
    dial?: string;
    tokens?: string;
    rings?: string;
    usePromos?: boolean;
}

export interface GamePlayerUserSettings {
    cardSize?: string;
    disableGravatar?: boolean;
    windowTimer?: number;
    background?: string;
    optionSettings?: OptionSettings;
    promptedActionWindows?: Record<string, boolean>;
    timerSettings?: TimerSettings;
    patron?: PatronSettings;
}

export interface GamePlayerUser {
    username: string;
    emailHash?: string;
    promptedActionWindows?: Record<string, boolean>;
    settings?: GamePlayerUserSettings;
}

class Player extends GameObject {
    user: GamePlayerUser;
    emailHash: string;
    declare id: string;
    owner: boolean;
    declare printedType: string;
    socket: Socket | null | undefined;
    disconnected: boolean;
    left: boolean;
    lobbyId: string | null;

    readonly zones: PlayerZones = new PlayerZones();

    faction: DeckFaction;
    stronghold: StrongholdCard | null;
    role: RoleCard | null;

    hideProvinceDeck: boolean;
    takenDynastyMulligan: boolean;
    takenConflictMulligan: boolean;
    passedDynasty: boolean;
    actionPhasePriority: boolean;
    honorBidModifier: number;
    showBid: number;
    conflictManager: PlayerConflictManager;
    stateBuilder: PlayerStateBuilder;
    imperialFavor: string;

    clock: ClockInterface;

    limitedPlayed: number;
    deck: DeckDTO;
    costManager: PlayerCostManager;
    abilityMaxByIdentifier: Record<string, AbilityLimit>;
    promptedActionWindows: Record<string, boolean>;
    timerSettings: TimerSettings;
    optionSettings: OptionSettings;
    resetTimerAtEndOfRound: boolean;
    private honorTracker: HonorTracker = new HonorTracker();

    promptState: PlayerPromptState;
    opponent?: Player;
    preparedDeck!: ReturnType<Deck['prepare']>;
    outsideTheGameCards!: DrawCard[];
    fate: number = 0;
    readyToStart: boolean = false;
    maxLimited: number = 1;
    firstPlayer: boolean = false;
    showConflict: boolean = false;
    showDynasty: boolean = false;
    noTimer: boolean = false;

    constructor(id: string, user: GamePlayerUser, owner: boolean, game: Game, clockdetails?: ClockConfig) {
        super(game, user.username);
        this.user = user;
        this.emailHash = this.user.emailHash ?? '';
        this.id = id;
        this.owner = owner;
        this.printedType = 'player';
        this.socket = null;
        this.disconnected = false;
        this.left = false;
        this.lobbyId = null;

        this.faction = {};
        this.stronghold = null;
        this.role = null;

        this.hideProvinceDeck = false;
        this.takenDynastyMulligan = false;
        this.takenConflictMulligan = false;
        this.passedDynasty = false;
        this.actionPhasePriority = false;
        this.honorBidModifier = 0;
        this.showBid = 0;
        this.conflictManager = new PlayerConflictManager(this, this.game);
        this.stateBuilder = new PlayerStateBuilder(this, this.game);
        this.imperialFavor = '';

        this.clock = clockFor(this, clockdetails);

        this.limitedPlayed = 0;
        this.deck = {};
        this.costManager = new PlayerCostManager(this, this.game);
        this.abilityMaxByIdentifier = {};
        this.promptedActionWindows = user.promptedActionWindows || {
            dynasty: true,
            draw: true,
            preConflict: true,
            conflict: true,
            fate: true,
            regroup: true
        };
        const settings = user.settings ?? {};
        this.timerSettings = settings.timerSettings ?? {};
        this.timerSettings.windowTimer = settings.windowTimer;
        this.optionSettings = settings.optionSettings ?? {};
        this.resetTimerAtEndOfRound = false;
        this.promptState = new PlayerPromptState(this);
    }

    get honor(): number {
        return this.honorTracker.honor;
    }

    set honor(value: number) {
        this.honorTracker.honor = value;
    }

    get selectedCards(): BaseCard[] {
        return this.promptState.selectedCards ?? [];
    }

    get dynastyDeck(): DrawCard[] {
        return this.zones.dynastyDeck;
    }
    set dynastyDeck(v: DrawCard[]) {
        this.zones.dynastyDeck = v;
    }

    get conflictDeck(): DrawCard[] {
        return this.zones.conflictDeck;
    }
    set conflictDeck(v: DrawCard[]) {
        this.zones.conflictDeck = v;
    }

    get provinceDeck(): BaseCard[] {
        return this.zones.provinceDeck;
    }
    set provinceDeck(v: BaseCard[]) {
        this.zones.provinceDeck = v;
    }

    get hand(): DrawCard[] {
        return this.zones.hand;
    }
    set hand(v: DrawCard[]) {
        this.zones.hand = v;
    }

    get cardsInPlay(): DrawCard[] {
        return this.zones.cardsInPlay;
    }
    set cardsInPlay(v: DrawCard[]) {
        this.zones.cardsInPlay = v;
    }

    get strongholdProvince(): BaseCard[] {
        return this.zones.strongholdProvince;
    }
    set strongholdProvince(v: BaseCard[]) {
        this.zones.strongholdProvince = v;
    }

    get provinceOne(): BaseCard[] {
        return this.zones.provinceOne;
    }
    set provinceOne(v: BaseCard[]) {
        this.zones.provinceOne = v;
    }

    get provinceTwo(): BaseCard[] {
        return this.zones.provinceTwo;
    }
    set provinceTwo(v: BaseCard[]) {
        this.zones.provinceTwo = v;
    }

    get provinceThree(): BaseCard[] {
        return this.zones.provinceThree;
    }
    set provinceThree(v: BaseCard[]) {
        this.zones.provinceThree = v;
    }

    get provinceFour(): BaseCard[] {
        return this.zones.provinceFour;
    }
    set provinceFour(v: BaseCard[]) {
        this.zones.provinceFour = v;
    }

    get dynastyDiscardPile(): DrawCard[] {
        return this.zones.dynastyDiscardPile;
    }
    set dynastyDiscardPile(v: DrawCard[]) {
        this.zones.dynastyDiscardPile = v;
    }

    get conflictDiscardPile(): DrawCard[] {
        return this.zones.conflictDiscardPile;
    }
    set conflictDiscardPile(v: DrawCard[]) {
        this.zones.conflictDiscardPile = v;
    }

    get removedFromGame(): BaseCard[] {
        return this.zones.removedFromGame;
    }
    set removedFromGame(v: BaseCard[]) {
        this.zones.removedFromGame = v;
    }

    get additionalPiles(): Record<string, AdditionalPile> {
        return this.zones.additionalPiles;
    }
    set additionalPiles(v: Record<string, AdditionalPile>) {
        this.zones.additionalPiles = v;
    }

    get underneathStronghold(): BaseCard[] {
        return this.zones.underneathStronghold;
    }
    set underneathStronghold(v: BaseCard[]) {
        this.zones.underneathStronghold = v;
    }

    getSourceList(source: string): BaseCard[] {
        return this.zones.getSourceList(source);
    }

    updateSourceList(source: string, targetList: BaseCard[]): void {
        this.zones.updateSourceList(source, targetList);
    }

    createAdditionalPile(name: string, properties?: Record<string, unknown>): void {
        this.zones.createAdditionalPile(name, properties);
    }

    getDynastyCardInProvince(location: string): DrawCard | undefined {
        return this.zones.getDynastyCardInProvince(location);
    }

    getDynastyCardsInProvince(location: string): DrawCard[] {
        return this.zones.getDynastyCardsInProvince(location);
    }

    getProvinceCardInProvince(location: string): ProvinceCard | undefined {
        return this.zones.getProvinceCardInProvince(location);
    }

    startClock(): void {
        this.clock.start();
        if(this.opponent) {
            this.opponent.clock.opponentStart();
        }
    }

    stopNonChessClocks(): void {
        if(this.clock.name !== 'Chess Clock') {
            this.stopClock();
        }
    }

    stopClock(): void {
        this.clock.stop();
    }

    resetClock(): void {
        this.clock.reset();
    }

    isCardUuidInList(list: BaseCard[], card: BaseCard): boolean {
        return list.some((c) => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list: BaseCard[], card: BaseCard): boolean {
        return list.some((c) => {
            return c.name === card.name;
        });
    }

    removeCardByUuid(list: BaseCard[], uuid: string): BaseCard[] {
        return list.filter((card) => {
            return card.uuid !== uuid;
        });
    }

    findCardByName(list: BaseCard[], name: string): BaseCard | undefined {
        return this.findCard(list, (card) => card.name === name);
    }

    findCardByUuid(list: BaseCard[], uuid: string): BaseCard | undefined {
        return this.findCard(list, (card) => card.uuid === uuid);
    }

    findCardInPlayByUuid(uuid: string): DrawCard | null {
        return this.findCard(this.cardsInPlay, (card) => card.uuid === uuid) as DrawCard | null;
    }

    findCard(cardList: BaseCard[], predicate: (card: BaseCard) => boolean): BaseCard | undefined {
        const cards = this.findCards(cardList, predicate);
        if(!cards || cards.length === 0) {
            return undefined;
        }

        return cards[0];
    }

    findCards(cardList: BaseCard[], predicate: (card: BaseCard) => boolean): BaseCard[] {
        if(!cardList) {
            return [];
        }

        const cardsToReturn: BaseCard[] = [];

        for(const card of cardList) {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            const attachments = (card as DrawCard).attachments;
            if(attachments) {
                cardsToReturn.push(...attachments.filter(predicate));
            }
        }

        return cardsToReturn;
    }

    isTraitInPlay(trait: string): boolean {
        return this.game.allCards.some((card: BaseCard) => {
            return (
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Location.PlayArea ||
                    (card.isProvince && !(card as ProvinceCard).isBroken) ||
                    (card.isInProvince() && card.type === CardType.Holding))
            );
        });
    }

    isCharacterTraitInPlay(trait: string): boolean {
        return this.game.allCards.some((card: BaseCard) => {
            return (
                card.type === CardType.Character &&
                card.controller === this &&
                card.hasTrait(trait) &&
                card.isFaceup() &&
                (card.location === Location.PlayArea ||
                    (card.isProvince && !(card as ProvinceCard).isBroken) ||
                    (card.isInProvince() && (card.type as CardType) === CardType.Holding))
            );
        });
    }

    areLocationsAdjacent(locationA: Location, locationB: Location): boolean {
        switch(locationA) {
            case Location.ProvinceOne:
                return locationB === Location.ProvinceTwo;
            case Location.ProvinceTwo:
                return locationB === Location.ProvinceOne || locationB === Location.ProvinceThree;
            case Location.ProvinceThree:
                return locationB === Location.ProvinceTwo || locationB === Location.ProvinceFour;
            case Location.ProvinceFour:
                return locationB === Location.ProvinceThree;
            default:
                return false;
        }
    }

    getProvinceCards(): ProvinceCard[] {
        const gameModeProvinceCount = this.game.gameMode === GameModes.Skirmish ? 3 : 5;
        const locations = [
            Location.ProvinceOne,
            Location.ProvinceTwo,
            Location.ProvinceThree,
            Location.ProvinceFour,
            Location.StrongholdProvince
        ].slice(0, gameModeProvinceCount);
        return locations.map((location) => this.getProvinceCardInProvince(location) as ProvinceCard);
    }

    anyCardsInPlay(predicate: (card: DrawCard) => boolean): boolean {
        return this.game.allCards.some(
            (card) => card.controller === this && card.location === Location.PlayArea && predicate(card as DrawCard)
        );
    }

    getAllConflictCards(predicate: (card: DrawCard) => boolean = () => true): DrawCard[] {
        return this.game.allCards.filter(
            (card) => card.owner === this && card.isConflict && predicate(card as DrawCard)
        ) as DrawCard[];
    }

    filterCardsInPlay(predicate: (card: DrawCard) => boolean): DrawCard[] {
        return this.game.allCards.filter(
            (card) => card.controller === this && card.location === Location.PlayArea && predicate(card as DrawCard)
        ) as DrawCard[];
    }

    hasComposure(): boolean {
        return this.opponent !== undefined && this.opponent.showBid > this.showBid;
    }

    hasLegalConflictDeclaration(properties: ConflictDeclarationProperties): boolean {
        return this.conflictManager.hasLegalConflictDeclaration(properties);
    }

    getConflictOpportunities(): number {
        return this.conflictManager.getConflictOpportunities();
    }

    getRemainingConflictOpportunitiesForType(type: string): number {
        return this.conflictManager.getRemainingConflictOpportunitiesForType(type);
    }

    getLegalConflictTypes(properties: ConflictDeclarationProperties): string[] {
        return this.conflictManager.getLegalConflictTypes(properties);
    }

    getConflictsWhenMaxIsSet(maxConflicts: number): number {
        return this.conflictManager.getConflictsWhenMaxIsSet(maxConflicts);
    }

    getMaxConflictOpportunitiesForPlayerByType(type: string): number {
        return this.conflictManager.getMaxConflictOpportunitiesForPlayerByType(type);
    }

    get declaredConflictOpportunities(): Record<string, number> {
        return this.conflictManager.declaredConflictOpportunities;
    }

    get defaultAllowedConflicts(): Record<string, number> {
        return this.conflictManager.defaultAllowedConflicts;
    }

    getProvinces(predicate: (card: ProvinceCard) => boolean = () => true): ProvinceCard[] {
        return this.game
            .getProvinceArray()
            .reduce(
                (array: ProvinceCard[], location: Location) =>
                    array.concat(
                        this.getSourceList(location).filter(
                            (card) => card.type === CardType.Province && predicate(card as ProvinceCard)
                        ) as ProvinceCard[]
                    ),
                []
            );
    }

    getNumberOfFaceupProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return this.getProvinces((card) => card.isFaceup() && predicate(card)).length;
    }

    getNumberOfOpponentsFaceupProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return (this.opponent && this.opponent.getNumberOfFaceupProvinces(predicate)) || 0;
    }

    getNumberOfFacedownProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return this.getProvinces((card) => card.isFacedown() && predicate(card)).length;
    }

    getNumberOfOpponentsFacedownProvinces(predicate: (card: ProvinceCard) => boolean = () => true): number {
        return (this.opponent && this.opponent.getNumberOfFacedownProvinces(predicate)) || 0;
    }

    getNumberOfCardsInPlay(predicate: (card: DrawCard) => boolean): number {
        return this.game.allCards.reduce((num: number, card) => {
            if(card.controller === this && card.location === Location.PlayArea && predicate(card as DrawCard)) {
                return num + 1;
            }
            return num;
        }, 0);
    }

    getNumberOfHoldingsInPlay(): number {
        return this.getHoldingsInPlay().length;
    }

    getHoldingsInPlay(): BaseCard[] {
        return this.game
            .getProvinceArray()
            .reduce(
                (array: BaseCard[], province: Location) =>
                    array.concat(
                        this.getSourceList(province).filter(
                            (card) => card.getType() === CardType.Holding && card.isFaceup()
                        )
                    ),
                []
            );
    }

    isCardInPlayableLocation(card: BaseCard, playingType: PlayType | null = null): boolean {
        return this.costManager.isCardInPlayableLocation(card, playingType);
    }

    findPlayType(card: BaseCard): PlayType | undefined {
        return this.costManager.findPlayType(card);
    }

    getDuplicateInPlay(card: DrawCard): DrawCard | undefined {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, (playCard) => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        }) as DrawCard | undefined;
    }

    drawCardsToHand(numCards: number): void {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.length) {
            remainingCards = numCards - this.conflictDeck.length;
            const cards = this.conflictDeck.slice();
            this.deckRanOutOfCards('conflict');
            this.game.queueSimpleStep(() => {
                for(const card of cards) {
                    this.moveCard(card, Location.Hand);
                }
            });
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        } else {
            for(const card of this.conflictDeck.slice(0, numCards)) {
                this.moveCard(card, Location.Hand);
            }
        }
    }

    deckRanOutOfCards(deck: string): void {
        const discardPile = this.getSourceList(deck + ' discard pile');
        const action = GameActions.loseHonor({ amount: this.game.gameMode === GameModes.Skirmish ? 3 : 5 });
        if(action.canAffect(this, this.game.getFrameworkContext())) {
            this.game.addMessage(
                '{0}\'s {1} deck has run out of cards, so they lose {2} honor',
                this,
                deck,
                this.game.gameMode === GameModes.Skirmish ? 3 : 5
            );
        } else {
            this.game.addMessage('{0}\'s {1} deck has run out of cards', this, deck);
        }
        action.resolve(this, this.game.getFrameworkContext());
        this.game.queueSimpleStep(() => {
            discardPile.forEach((card: BaseCard) => this.moveCard(card, deck + ' deck'));
            if(deck === 'dynasty') {
                this.shuffleDynastyDeck();
            } else {
                this.shuffleConflictDeck();
            }
        });
    }

    replaceDynastyCard(location: string): boolean {
        const province = this.getProvinceCardInProvince(location);

        if(!province || this.getSourceList(location).length > 1) {
            return false;
        }
        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.replaceDynastyCard(location));
        } else {
            let refillAmount = 1;
            if(province) {
                const amount = province.mostRecentEffect(EffectName.RefillProvinceTo);
                if(amount) {
                    refillAmount = amount;
                }
            }

            this.refillProvince(location, refillAmount);
        }
        return true;
    }

    putTopDynastyCardInProvince(location: string, facedown: boolean = false): boolean {
        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.putTopDynastyCardInProvince(location, facedown));
        } else {
            const cardFromDeck = this.dynastyDeck[0];
            this.moveCard(cardFromDeck, location);
            cardFromDeck.facedown = facedown;
            return true;
        }
        return true;
    }

    refillProvince(location: string, refillAmount: number): boolean {
        if(refillAmount <= 0) {
            return true;
        }

        if(this.dynastyDeck.length === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount));
            return true;
        }
        const province = this.getProvinceCardInProvince(location);
        const refillFunc = province?.mostRecentEffect(EffectName.CustomProvinceRefillEffect);
        if(refillFunc) {
            refillFunc(this, province);
        } else {
            this.moveCard(this.dynastyDeck[0], location);
        }

        this.game.queueSimpleStep(() => this.refillProvince(location, refillAmount - 1));
        return true;
    }

    shuffleConflictDeck(): void {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.emitEvent(EventName.OnDeckShuffled, { player: this, deck: Decks.ConflictDeck });
        this.conflictDeck = shuffle(this.conflictDeck);
    }

    shuffleDynastyDeck(): void {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.emitEvent(EventName.OnDeckShuffled, { player: this, deck: Decks.DynastyDeck });
        this.dynastyDeck = shuffle(this.dynastyDeck);
    }

    prepareDecks(): void {
        const deck = new Deck(this.deck);
        const preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction ?? {};
        this.provinceDeck = preparedDeck.provinceCards;
        if(preparedDeck.stronghold instanceof StrongholdCard) {
            this.stronghold = preparedDeck.stronghold;
        }
        if(preparedDeck.role instanceof RoleCard) {
            this.role = preparedDeck.role;
        }
        this.conflictDeck = preparedDeck.conflictCards;
        this.dynastyDeck = preparedDeck.dynastyCards;
        this.preparedDeck = preparedDeck;
        this.conflictDeck.forEach((card: DrawCard) => {
            if(card.type === CardType.Event) {
                for(const reaction of card.abilities.reactions) {
                    reaction.registerEvents();
                }
            }
        });
        this.outsideTheGameCards = preparedDeck.outsideTheGameCards;
    }

    initialise(): void {
        this.opponent = this.game.getOtherPlayer(this);

        this.prepareDecks();
        this.shuffleConflictDeck();
        this.shuffleDynastyDeck();

        this.fate = 0;
        this.honor = 0;
        this.readyToStart = false;
        this.maxLimited = 1;
        this.firstPlayer = false;
    }

    addCostReducer(source: BaseCard, properties: CostReducerProps): CostReducer {
        return this.costManager.addCostReducer(source, properties);
    }

    removeCostReducer(reducer: CostReducer): void {
        this.costManager.removeCostReducer(reducer);
    }

    addPlayableLocation(type: PlayType, player: Player, location: Location, cards: BaseCard[] = []): PlayableLocation | undefined {
        return this.costManager.addPlayableLocation(type, player, location, cards);
    }

    removePlayableLocation(location: PlayableLocation): void {
        this.costManager.removePlayableLocation(location);
    }

    getAlternateFatePools(playingType: PlayType | undefined, card: DrawCard, context?: AbilityContext): FatePool[] {
        return this.costManager.getAlternateFatePools(playingType, card, context);
    }

    getMinimumCost(playingType: PlayType | undefined, context: AbilityContext, target?: BaseCard, ignoreType: boolean = false): number {
        return this.costManager.getMinimumCost(playingType, context, target, ignoreType);
    }

    getReducedCost(playingType: PlayType | undefined, card: DrawCard, target?: BaseCard, ignoreType: boolean = false): number {
        return this.costManager.getReducedCost(playingType, card, target, ignoreType);
    }

    getTotalCostModifiers(playingType: PlayType | undefined, card: DrawCard, target?: BaseCard, ignoreType: boolean = false): number {
        return this.costManager.getTotalCostModifiers(playingType, card, target, ignoreType);
    }

    getAvailableAlternateFate(playingType: PlayType | undefined, context: AbilityContext): number {
        return this.costManager.getAvailableAlternateFate(playingType, context);
    }

    getTargetingCost(abilitySource: BaseCard, targets: GameObject | GameObject[]): number {
        return this.costManager.getTargetingCost(abilitySource, targets);
    }

    markUsedReducers(playingType: PlayType | undefined, card: DrawCard, target: BaseCard | null = null): void {
        this.costManager.markUsedReducers(playingType, card, target);
    }

    get costReducers(): CostReducer[] {
        return this.costManager.costReducers;
    }

    get playableLocations(): PlayableLocation[] {
        return this.costManager.playableLocations;
    }

    registerAbilityMax(maxIdentifier: string, limit: AbilityLimit): void {
        if(this.abilityMaxByIdentifier[maxIdentifier]) {
            return;
        }

        this.abilityMaxByIdentifier[maxIdentifier] = limit;
        limit.registerEvents(this.game);
    }

    isAbilityAtMax(maxIdentifier: string): boolean {
        const limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(!limit) {
            return false;
        }

        return limit.isAtMax(this);
    }

    incrementAbilityMax(maxIdentifier: string): void {
        const limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(limit) {
            limit.increment(this);
        }
    }

    beginDynasty(): void {
        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.resetConflictOpportunities();

        this.cardsInPlay.forEach((card: DrawCard) => {
            card.new = false;
        });
        this.passedDynasty = false;
    }

    collectFate(): void {
        this.modifyFate(this.getTotalIncome());
        this.game.raiseEvent(EventName.OnFateCollected, { player: this });
    }

    resetConflictOpportunities(): void {
        this.conflictManager.resetConflictOpportunities();
    }

    showConflictDeck(): void {
        this.showConflict = true;
    }

    showDynastyDeck(): void {
        this.showDynasty = true;
    }


    drop(cardId: string, source: string, target: string): void {
        const sourceList = this.getSourceList(source);
        const card = this.findCardByUuid(sourceList, cardId);

        if(
            !this.game.manualMode ||
            source === target ||
            !this.isLegalLocationForCard(card, target) ||
            !card ||
            card.location !== source
        ) {
            return;
        }

        if(
            card.isProvince &&
            target !== Location.ProvinceDeck &&
            this.getSourceList(target).some((other) => other.isProvince)
        ) {
            return;
        }

        let display: string | BaseCard = 'a card';
        if(
            (card.isFaceup() && source !== Location.Hand) ||
            [
                Location.PlayArea,
                Location.DynastyDiscardPile,
                Location.ConflictDiscardPile,
                Location.RemovedFromGame
            ].includes(target as Location)
        ) {
            display = card;
        }

        this.game.addMessage('{0} manually moves {1} from their {2} to their {3}', this, display, source, target);
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    isLegalLocationForCard(card: BaseCard | undefined, location: string): boolean {
        if(!card) {
            return false;
        }

        if(this.additionalPiles[location]) {
            return true;
        }

        const conflictCardLocations = [
            ...this.game.getProvinceArray(),
            Location.Hand,
            Location.ConflictDeck,
            Location.ConflictDiscardPile,
            Location.RemovedFromGame
        ];
        const dynastyCardLocations = [
            ...this.game.getProvinceArray(),
            Location.DynastyDeck,
            Location.DynastyDiscardPile,
            Location.RemovedFromGame,
            Location.UnderneathStronghold
        ];
        // A character's printed type is always 'character'; dynasty and conflict
        // characters live in different zones, so split that one type into two
        // derived categories. These are not CardType — they are lookup keys.
        type LocationCategory = CardType | 'dynastyCharacter' | 'conflictCharacter';
        const legalLocations: Partial<Record<LocationCategory, Location[]>> = {
            [CardType.Stronghold]: [Location.StrongholdProvince],
            [CardType.Role]: [Location.Role],
            [CardType.Province]: [...this.game.getProvinceArray(), Location.ProvinceDeck],
            [CardType.Holding]: dynastyCardLocations,
            conflictCharacter: [...conflictCardLocations, Location.PlayArea],
            dynastyCharacter: [...dynastyCardLocations, Location.PlayArea],
            [CardType.Event]: [...new Set([...conflictCardLocations, ...dynastyCardLocations, Location.BeingPlayed])],
            [CardType.Attachment]: [...conflictCardLocations, Location.PlayArea]
        };

        let category: LocationCategory = card.type;
        if(location === Location.DynastyDiscardPile || location === Location.ConflictDiscardPile) {
            category = (card.printedType as CardType) || card.type;
        }

        if(category === CardType.Character) {
            category = card.isDynasty ? 'dynastyCharacter' : 'conflictCharacter';
        }

        return !!legalLocations[category]?.includes(location as Location);
    }

    promptForAttachment(card: DrawCard, playingType?: string): void {
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType ?? ''));
    }

    isAttackingPlayer(): boolean {
        return !!this.game.currentConflict && this.game.currentConflict.attackingPlayer === this;
    }

    isDefendingPlayer(): boolean {
        return !!this.game.currentConflict && this.game.currentConflict.defendingPlayer === this;
    }

    resetForConflict(): void {
        this.cardsInPlay.forEach((card: DrawCard) => {
            card.resetForConflict();
        });
    }

    get honorBid(): number {
        return Math.max(0, this.showBid + this.honorBidModifier);
    }

    get gloryModifier(): number {
        return this.getEffects(EffectName.ChangePlayerGloryModifier).reduce(
            (total: number, value: number) => total + value,
            0
        );
    }

    get skillModifier(): number {
        return this.getEffects(EffectName.ChangePlayerSkillModifier).reduce(
            (total: number, value: number) => total + value,
            0
        );
    }

    honorGained(round: number | null = null, phase: string | null = null, onlyPositive: boolean = false): number {
        return this.honorTracker.honorGained(round, phase, onlyPositive);
    }

    modifyFate(amount: number): void {
        const before = this.fate;
        this.fate = Math.max(0, this.fate + amount);
        const actual = this.fate - before;
        if(actual !== 0 && this.game) {
            this.game.addAnimation({ type: 'fate', playerName: this.name, amount: actual });
        }
    }

    modifyHonor(amount: number): void {
        this.honorTracker.modifyHonor(amount, this.game.currentPhase, this.game.roundNumber);
    }

    resetHonorEvents(round: number, phase: string): void {
        this.honorTracker.resetHonorEvents(round, phase);
    }

    isMoreHonorable(): boolean {
        if(this.anyEffect(EffectName.ConsideredLessHonorable)) {
            return false;
        }
        if(this.opponent && this.opponent.anyEffect(EffectName.ConsideredLessHonorable)) {
            return true;
        }
        return this.opponent !== undefined && this.honor > this.opponent.honor;
    }

    isLessHonorable(): boolean {
        if(this.anyEffect(EffectName.ConsideredLessHonorable)) {
            return true;
        }
        if(this.opponent && this.opponent.anyEffect(EffectName.ConsideredLessHonorable)) {
            return false;
        }
        return this.opponent !== undefined && this.honor < this.opponent.honor;
    }

    hasAffinity(trait: string, context?: AbilityContext): boolean {
        if(!this.checkRestrictions('haveAffinity', context)) {
            return false;
        }

        for(const cheatedAffinities of this.getEffects(EffectName.SatisfyAffinity)) {
            if(cheatedAffinities.includes(trait)) {
                return true;
            }
        }

        return this.cardsInPlay.some((card: DrawCard) => card.type === CardType.Character && card.hasTrait(trait));
    }

    getClaimedRings(): Ring[] {
        return Object.values(this.game.rings).filter((ring: Ring) => ring.isConsideredClaimed(this));
    }

    getGloryCount(): number {
        return this.cardsInPlay.reduce(
            (total: number, card: DrawCard) => total + card.getContributionToImperialFavor(),
            this.getClaimedRings().length + this.gloryModifier
        );
    }

    claimImperialFavor(favorType?: string): void {
        if(this.opponent) {
            this.opponent.loseImperialFavor();
        }
        const sovereign = (this.game.gameMode === GameModes.Emerald || this.game.gameMode === GameModes.Sanctuary) ? 'Empress\'' : 'Emperor\'s';
        if(this.game.gameMode === GameModes.Skirmish) {
            this.imperialFavor = 'both';
            this.game.addMessage('{0} claims the ' + sovereign + ' favor!', this);
            return;
        }
        if(favorType && favorType !== FavorType.Both) {
            this.imperialFavor = favorType;
            this.game.addMessage('{0} claims the ' + sovereign + ' {1} favor!', this, favorType);
            return;
        }

        const handlers = ['military', 'political'].map((type) => {
            return () => {
                this.imperialFavor = type;
                this.game.addMessage('{0} claims the ' + sovereign + ' {1} favor!', this, type);
            };
        });
        this.game.promptWithHandlerMenu(this, {
            activePromptTitle: 'Which side of the Imperial Favor would you like to claim?',
            source: 'Imperial Favor',
            choices: ['Military', 'Political'],
            handlers: handlers
        });
    }

    loseImperialFavor(): void {
        this.imperialFavor = '';
    }

    selectDeck(deck: DeckDTO): void {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;
        if(deck.stronghold && deck.stronghold.length > 0) {
            this.stronghold = new StrongholdCard(this, deck.stronghold[0] as CardData);
        }
        this.faction = deck.faction ?? {};
    }

    moveCard(card: BaseCard, targetLocation: string, options: MoveCardOptions = {}): void {
        this.removeCardFromPile(card);

        if(targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        const targetPile = this.getSourceList(targetLocation);

        if(!this.isLegalLocationForCard(card, targetLocation) || (targetPile && targetPile.includes(card))) {
            return;
        }

        const location = card.location;

        if(
            location === Location.PlayArea ||
            (card.type === CardType.Holding &&
                card.isInProvince() &&
                !this.game.getProvinceArray().includes(targetLocation as Location))
        ) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for(const attachment of (card as DrawCard).attachments || []) {
                attachment.leavesPlay(targetLocation);
                attachment.owner.moveCard(
                    attachment,
                    attachment.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
                );
            }

            card.leavesPlay(targetLocation);
            card.controller = this;
        } else if(targetLocation === Location.PlayArea) {
            (card as DrawCard).setDefaultController(this);
            card.controller = this;
            if(card.type === CardType.Attachment) {
                this.promptForAttachment(card as DrawCard);
                return;
            }
        } else if(location === Location.BeingPlayed && card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if(card.type === CardType.Holding && this.game.getProvinceArray().includes(targetLocation as Location)) {
            card.controller = this;
        } else {
            card.controller = card.owner;
        }

        if(this.game.getProvinceArray().includes(targetLocation as Location)) {
            if([Location.DynastyDeck].includes(location as Location)) {
                card.facedown = true;
            }
            if(!this.takenDynastyMulligan && card.isDynasty) {
                card.facedown = false;
            }
            targetPile.push(card);
        } else if([Location.ConflictDeck, Location.DynastyDeck].includes(targetLocation as Location) && !options.bottom) {
            targetPile.unshift(card);
        } else if(
            [Location.ConflictDiscardPile, Location.DynastyDiscardPile, Location.RemovedFromGame].includes(
                targetLocation as Location
            )
        ) {
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
        }

        card.moveTo(targetLocation as Location);
    }

    removeCardFromPile(card: BaseCard): void {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        const originalLocation = card.location;
        let originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    getTotalIncome(): number {
        return this.game.gameMode === GameModes.Skirmish ? 6 : (this.stronghold?.cardData.fate ?? 0);
    }

    getTotalHonor(): number {
        return this.honorTracker.getTotalHonor();
    }

    getFate(): number {
        return this.fate;
    }

    setSelectedCards(cards: BaseCard[]): void {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards(): void {
        this.promptState.clearSelectedCards();
    }

    setSelectableCards(cards: BaseCard[]): void {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards(): void {
        this.promptState.clearSelectableCards();
    }

    setSelectableRings(rings: Ring[]): void {
        this.promptState.setSelectableRings(rings);
    }

    clearSelectableRings(): void {
        this.promptState.clearSelectableRings();
    }

    getSummaryForHand(list: BaseCard[], activePlayer: Player, hideWhenFaceup: boolean): CardSummary[] {
        return this.stateBuilder.getSummaryForHand(list, activePlayer, hideWhenFaceup);
    }

    getSummaryForCardList(list: BaseCard[], activePlayer: Player, hideWhenFaceup?: boolean): CardSummary[] {
        return this.stateBuilder.getSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getSortedSummaryForCardList(list: BaseCard[], activePlayer: Player, hideWhenFaceup?: boolean): CardSummary[] {
        return this.stateBuilder.getSortedSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getCardSelectionState(card: BaseCard) {
        return this.promptState.getCardSelectionState(card);
    }

    getRingSelectionState(ring: Ring) {
        return this.promptState.getRingSelectionState(ring);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt: Parameters<PlayerPromptState['setPrompt']>[0]): void {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt(): void {
        this.promptState.cancelPrompt();
    }

    passDynasty(): void {
        this.passedDynasty = true;
    }

    setShowBid(bid: number): void {
        this.showBid = bid;
        this.game.addMessage('{0} reveals a bid of {1}', this, bid);
    }

    isTopConflictCardShown(activePlayer?: Player): boolean {
        const resolvedPlayer = activePlayer ?? this;

        if(resolvedPlayer.conflictDeck && resolvedPlayer.conflictDeck.length <= 0) {
            return false;
        }

        if(resolvedPlayer === this) {
            return (
                this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Any) ||
                this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Self)
            );
        }

        return (
            this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Any) ||
            this.getEffects(EffectName.ShowTopConflictCard).includes(Players.Opponent)
        );
    }

    eventsCannotBeCancelled(): boolean {
        return this.anyEffect(EffectName.EventsCannotBeCancelled);
    }

    isTopDynastyCardShown(_activePlayer?: Player): boolean {
        if(this.dynastyDeck.length <= 0) {
            return false;
        }
        return this.anyEffect(EffectName.ShowTopDynastyCard);
    }

    resolveRingEffects(elements: string | string[], optional: boolean = true): void {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        optional = optional && elements.length === 1;
        let effects = elements.map((element) => RingEffects.contextFor(this, element, optional));
        effects = [...effects].sort((a, b) => {
            const aVal = this.firstPlayer ? a.ability.defaultPriority : -a.ability.defaultPriority;
            const bVal = this.firstPlayer ? b.ability.defaultPriority : -b.ability.defaultPriority;
            return aVal - bVal;
        });
        this.game.openSimultaneousEffectWindow(
            effects.map((context) => ({
                title: context.ability.title,
                handler: () => this.game.resolveAbility(context)
            }))
        );
    }

    isKihoPlayedThisConflict(context: AbilityContext, cardBeingPlayed: BaseCard): boolean {
        if(!context.game.currentConflict) {
            return false;
        }
        return (
            context.game.currentConflict.getNumberOfCardsPlayed(
                this,
                (card) => card.hasTrait('kiho') && card.uuid !== cardBeingPlayed.uuid
            ) > 0
        );
    }

    hasDeclaredConflictOfType(context: AbilityContext, conflictType: ConflictType): boolean {
        const conflicts = context.game.getConflicts(this);
        const declaredConflicts = conflicts.filter(conflict => conflict.declaredType === conflictType);

        return declaredConflicts.length > 0;
    }

    getStats() {
        return this.stateBuilder.getStats();
    }

    getState(activePlayer: Player): PlayerState {
        return this.stateBuilder.getState(activePlayer);
    }

    getShortSummary() {
        return this.stateBuilder.getShortSummary();
    }
}

export default Player;
