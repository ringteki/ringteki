import AbilityDsl from './abilitydsl.js';
import Effects from './effects.js';
import EffectSource from './EffectSource.js';
import { CardStatusManager } from './CardStatusManager.js';
import CardAbility from './CardAbility.js';
import TriggeredAbility from './TriggeredAbility.js';
import type { TriggeredAbilityProperties } from './TriggeredAbility.js';
import type BaseCardAbility from './BaseCardAbility.js';
import Game from './Game.js';

import { AbilityContext } from './AbilityContext.js';
import { CardAction } from './CardAction.js';
import {
    AbilityType,
    CardType,
    CharacterStatus,
    Duration,
    EffectName,
    EventName,
    Location,
    Players
} from './Constants.js';
import { ElementSymbol, type ElementSymbolInfo } from './ElementSymbol.js';
import {
    ActionProps,
    AttachmentConditionProps,
    PersistentEffectProps,
    TriggeredAbilityProps
} from './Interfaces.js';
import type { GameObject } from './GameObject.js';
import { StatusToken } from './StatusToken.js';
import Player from './Player.js';
import type BaseAction from './BaseAction.js';
import Ring from './Ring.js';
import type { CardEffect } from './Effects/types.js';
import type Effect from './Effects/Effect.js';
import type { EffectFactory } from './Effects/EffectBuilder.js';
import type { GainAllAbilities } from './Effects/Library/gainAllAbilities.js';
import type { EffectValue } from './Effects/EffectValue.js';
import type { CardData } from './types/CardData.js';

export type Faction = 'neutral' | 'crab' | 'crane' | 'dragon' | 'lion' | 'phoenix' | 'scorpion' | 'unicorn' | 'shadowlands';

export interface StoredPersistentEffect {
    duration: Duration;
    location: Location | Location[];
    condition?: (context: AbilityContext) => boolean;
    match?: (card: GameObject, context?: AbilityContext) => boolean;
    targetController?: Players;
    targetLocation?: Location | (string & {});
    effect: EffectFactory | EffectFactory[];
    createCopies?: boolean;
    ref?: Effect[];
    type?: EffectName;
    abilityType?: AbilityType;
    isKeywordEffect?: boolean;
}

interface AbilityProvidingEffectValue {
    calculate(target: GameObject, context: AbilityContext): unknown;
    getActions(target: GameObject): CardAction[];
    getReactions(target: GameObject): TriggeredAbility[];
    getPersistentEffects(): StoredPersistentEffect[];
}

interface CardAbilities {
    actions: CardAction[];
    reactions: TriggeredAbility[];
    persistentEffects: StoredPersistentEffect[];
    playActions: BaseAction[];
}

import { type PrintedKeyword, parseKeywords as parseKeywordsFromText } from './KeywordParser.js';

const PLAYABLE_OUT_OF_PLAY_LOCATIONS: Set<Location> = new Set([
    Location.RemovedFromGame,
    Location.ConflictDiscardPile,
    Location.DynastyDiscardPile,
    Location.UnderneathStronghold
]);

export interface CardSummary {
    attachments?: CardSummary[];
    childCards?: CardSummary[];
    [key: string]: unknown;
}

class BaseCard extends EffectSource {
    controller: Player;
    declare game: Game;

    declare id: string;
    printedName: string;
    inConflict = false;
    facedown: boolean = false;
    bowed = false;

    tokens: Record<string, number> = {};
    menu: { command: string; text: string }[] = [];

    showPopup: boolean = false;
    popupMenuText: string = '';
    abilities: CardAbilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
    traits: string[];
    printedFaction: string;
    location!: Location;

    isProvince: boolean = false;
    isConflict: boolean = false;
    isDynasty: boolean = false;
    isStronghold: boolean = false;
    packId: string | undefined;

    protected statusManager!: CardStatusManager;
    allowedAttachmentTraits = [] as string[];
    printedKeywords: Array<PrintedKeyword> = [];
    disguisedKeywordTraits = [] as string[];

    constructor(
        public owner: Player,
        public cardData: CardData
    ) {
        super(owner.game);
        this.statusManager = new CardStatusManager(this);
        this.controller = owner;

        this.id = cardData.id;
        this.printedName = cardData.name;
        this.printedType = cardData.type;
        this.traits = cardData.traits || [];
        this.printedFaction = cardData.clan ?? cardData.faction ?? '';

        this.setupCardAbilities(AbilityDsl);
        this.parseKeywords(cardData.text ? cardData.text.replace(/<[^>]*>/g, '').toLowerCase() : '');
    }

    get copiedCard(): BaseCard | undefined {
        let copyCharacterEffect = this.mostRecentEffect(EffectName.CopyCharacter);
        if (copyCharacterEffect) {
            return copyCharacterEffect;
        }
        let copyProvinceEffect = this.mostRecentEffect(EffectName.CopyProvince);
        if (copyProvinceEffect) {
            return copyProvinceEffect;
        }
        return undefined;
    }

    get name(): string {
        let copiedCard = this.copiedCard;
        return copiedCard ? copiedCard.printedName : this.printedName;
    }

    set name(name: string) {
        this.printedName = name;
    }

    get type(): CardType {
        return this.getType() as CardType;
    }

    #mostRecentCopyEffect(): CardEffect | undefined {
        const copyCharacterEffects = this.getRawEffects().filter((effect) => effect.type === EffectName.CopyCharacter);
        if (copyCharacterEffects.length > 0) {
            return copyCharacterEffects[copyCharacterEffects.length - 1]
        }

        const copyProvinceEffects = this.getRawEffects().filter((effect) => effect.type === EffectName.CopyProvince);
        if (copyProvinceEffects.length > 0) {
            return copyProvinceEffects[copyProvinceEffects.length - 1]
        }

        return undefined;
    }

    _getActions(ignoreDynamicGains = false): CardAction[] {
        let actions = this.abilities.actions;
        const mostRecentEffect = this.#mostRecentCopyEffect();
        if (mostRecentEffect) {
            actions = (mostRecentEffect.value as AbilityProvidingEffectValue).getActions(this);
        }
        const effectActions = (this.getEffects(EffectName.GainAbility) as CardAction[]).filter(
            (ability) => ability.abilityType === AbilityType.Action
        );

        for (const effect of this.getRawEffects()) {
            if (effect.type === EffectName.GainAllAbilities) {
                actions = actions.concat((effect.value as GainAllAbilities).getActions(this));
            }
        }
        if (!ignoreDynamicGains) {
            if (this.anyEffect(EffectName.GainAllAbilitiesDynamic)) {
                const context = (this.game.getFrameworkContext as (player?: Player | null) => AbilityContext)(this.controller);
                const effects = this.getRawEffects().filter(
                    (effect: CardEffect) => effect.type === EffectName.GainAllAbilitiesDynamic
                );
                effects.forEach((effect: CardEffect) => {
                    const value = effect.value as AbilityProvidingEffectValue;
                    value.calculate(this, context); //fetch new abilities
                    actions = actions.concat(value.getActions(this));
                });
            }
        }

        const lostAllNonKeywordsAbilities = this.anyEffect(EffectName.LoseAllNonKeywordAbilities);
        let allAbilities = actions.concat(effectActions);
        if (lostAllNonKeywordsAbilities) {
            allAbilities = allAbilities.filter((a) => a.isKeywordAbility());
        }
        return allAbilities;
    }

    get actions(): CardAction[] {
        return this._getActions();
    }

    _getReactions(ignoreDynamicGains = false): TriggeredAbility[] {
        const TriggeredAbilityTypes: AbilityType[] = [
            AbilityType.ForcedInterrupt,
            AbilityType.ForcedReaction,
            AbilityType.Interrupt,
            AbilityType.Reaction,
            AbilityType.WouldInterrupt
        ];
        let reactions = this.abilities.reactions;
        const mostRecentEffect = this.#mostRecentCopyEffect();
        if (mostRecentEffect) {
            reactions = (mostRecentEffect.value as AbilityProvidingEffectValue).getReactions(this);
        }
        const effectReactions = (this.getEffects(EffectName.GainAbility) as TriggeredAbility[]).filter((ability) =>
            TriggeredAbilityTypes.includes(ability.abilityType)
        );
        for (const effect of this.getRawEffects()) {
            if (effect.type === EffectName.GainAllAbilities) {
                reactions = reactions.concat((effect.value as GainAllAbilities).getReactions(this));
            }
        }
        if (!ignoreDynamicGains) {
            if (this.anyEffect(EffectName.GainAllAbilitiesDynamic)) {
                const effects = this.getRawEffects().filter(
                    (effect: CardEffect) => effect.type === EffectName.GainAllAbilitiesDynamic
                );
                const context = (this.game.getFrameworkContext as (player?: Player | null) => AbilityContext)(this.controller);
                effects.forEach((effect: CardEffect) => {
                    const value = effect.value as AbilityProvidingEffectValue;
                    value.calculate(this, context); //fetch new abilities
                    reactions = reactions.concat(value.getReactions(this));
                });
            }
        }

        const lostAllNonKeywordsAbilities = this.anyEffect(EffectName.LoseAllNonKeywordAbilities);
        let allAbilities = reactions.concat(effectReactions);
        if (lostAllNonKeywordsAbilities) {
            allAbilities = allAbilities.filter((a) => a.isKeywordAbility());
        }
        return allAbilities;
    }

    get reactions(): TriggeredAbility[] {
        return this._getReactions();
    }

    _getPersistentEffects(ignoreDynamicGains = false): StoredPersistentEffect[] {
        let gainedPersistentEffects = (this.getEffects(EffectName.GainAbility) as StoredPersistentEffect[]).filter(
            (ability) => ability.abilityType === AbilityType.Persistent
        );

        const mostRecentEffect = this.#mostRecentCopyEffect();
        if (mostRecentEffect) {
            return gainedPersistentEffects.concat((mostRecentEffect.value as AbilityProvidingEffectValue).getPersistentEffects());
        }
        for (const effect of this.getRawEffects()) {
            if (effect.type === EffectName.GainAllAbilities) {
                gainedPersistentEffects = gainedPersistentEffects.concat(
                    (effect.value as GainAllAbilities).getPersistentEffects()
                );
            }
        }
        if (!ignoreDynamicGains) {
            // This is needed even though there are no dynamic persistent effects
            // Because the effect itself is persistent and to ensure we pick up all reactions/interrupts, we need this check to happen
            // As the game state is applying the effect
            if (this.anyEffect(EffectName.GainAllAbilitiesDynamic)) {
                const effects = this.getRawEffects().filter(
                    (effect: CardEffect) => effect.type === EffectName.GainAllAbilitiesDynamic
                );
                const context = (this.game.getFrameworkContext as (player?: Player | null) => AbilityContext)(this.controller);
                effects.forEach((effect: CardEffect) => {
                    const value = effect.value as AbilityProvidingEffectValue;
                    value.calculate(this, context); //fetch new abilities
                    gainedPersistentEffects = gainedPersistentEffects.concat(value.getPersistentEffects());
                });
            }
        }

        const lostAllNonKeywordsAbilities = this.anyEffect(EffectName.LoseAllNonKeywordAbilities);
        if (lostAllNonKeywordsAbilities) {
            let allAbilities = this.abilities.persistentEffects.concat(gainedPersistentEffects);
            allAbilities = allAbilities.filter((a) => a.isKeywordEffect || a.type === EffectName.AddKeyword);
            return allAbilities;
        }
        return this.isBlank()
            ? gainedPersistentEffects
            : this.abilities.persistentEffects.concat(gainedPersistentEffects);
    }

    get persistentEffects(): StoredPersistentEffect[] {
        return this._getPersistentEffects();
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param {Object} ability - AbilityDsl object containing limits, costs, effects, and game actions
     */
    setupCardAbilities(_ability: typeof AbilityDsl): void {

    }

    action<Target extends BaseCard = BaseCard>(properties: ActionProps<this, Target>): void {
        this.abilities.actions.push(this.createAction(properties as ActionProps));
    }

    createAction(properties: ActionProps): CardAction {
        return new CardAction(this, properties);
    }

    triggeredAbility<Target extends BaseCard = BaseCard>(abilityType: AbilityType, properties: TriggeredAbilityProps<this, Target>): void {
        this.abilities.reactions.push(this.createTriggeredAbility(abilityType, properties));
    }

    createTriggeredAbility<Target extends BaseCard = BaseCard>(abilityType: AbilityType, properties: TriggeredAbilityProps<this, Target>): TriggeredAbility {
        // The author DSL props carry the target generic; the runtime ability erases it (Target is
        // covariant in the handler context), so downcast once to drop it.
        return new TriggeredAbility(this, abilityType, properties as TriggeredAbilityProperties<this>);
    }

    reaction<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void {
        this.triggeredAbility(AbilityType.Reaction, properties);
    }

    forcedReaction<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void {
        this.triggeredAbility(AbilityType.ForcedReaction, properties);
    }

    wouldInterrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void {
        this.triggeredAbility(AbilityType.WouldInterrupt, properties);
    }

    interrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void {
        this.triggeredAbility(AbilityType.Interrupt, properties);
    }

    forcedInterrupt<Target extends BaseCard = BaseCard>(properties: TriggeredAbilityProps<this, Target>): void {
        this.triggeredAbility(AbilityType.ForcedInterrupt, properties);
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect<T extends GameObject = GameObject>(properties: PersistentEffectProps<this, T>): void {
        const allowedLocations = [
            Location.Any,
            Location.ConflictDiscardPile,
            Location.PlayArea,
            Location.Provinces
        ];
        const defaultLocationForType: Record<string, Location> = {
            province: Location.Provinces,
            holding: Location.Provinces,
            stronghold: Location.Provinces
        };

        const locationProp = properties.location || defaultLocationForType[this.getType()] || Location.PlayArea;
        const location = Array.isArray(locationProp) ? locationProp[0] : locationProp;
        if (!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }
        this.abilities.persistentEffects.push({ duration: Duration.Persistent, location, ...properties } as StoredPersistentEffect);
    }

    attachmentConditions(properties: AttachmentConditionProps): void {
        const effects = [];
        if (properties.limit) {
            effects.push(Effects.attachmentLimit(properties.limit));
        }
        if (properties.myControl) {
            effects.push(Effects.attachmentMyControlOnly());
        }
        if (properties.opponentControlOnly) {
            effects.push(Effects.attachmentOpponentControlOnly());
        }
        if (properties.unique) {
            effects.push(Effects.attachmentUniqueRestriction());
        }
        if (properties.faction) {
            const factions = Array.isArray(properties.faction) ? properties.faction : [properties.faction];
            effects.push(Effects.attachmentFactionRestriction(factions));
        }
        if (properties.trait) {
            const traits = Array.isArray(properties.trait) ? properties.trait : [properties.trait];
            effects.push(Effects.attachmentTraitRestriction(traits));
        }
        if (properties.limitTrait) {
            const traitLimits = Array.isArray(properties.limitTrait) ? properties.limitTrait : [properties.limitTrait];
            traitLimits.forEach((traitLimit) => {
                const trait = Object.keys(traitLimit)[0];
                effects.push(Effects.attachmentRestrictTraitAmount({ [trait]: traitLimit[trait] }));
            });
        }
        if (properties.cardCondition) {
            effects.push(Effects.attachmentCardCondition(properties.cardCondition));
        }
        if (effects.length > 0) {
            this.persistentEffect({
                location: Location.Any,
                effect: effects
            });
        }
    }

    composure(properties: Omit<PersistentEffectProps<this>, 'condition'>): void {
        this.persistentEffect({
            condition: (context: AbilityContext<this>) => context.player.hasComposure(),
            ...properties
        } as PersistentEffectProps<this> & { isKeywordEffect: boolean });
    }

    dire<T extends GameObject = GameObject>(properties: PersistentEffectProps<this, T>): void {
        if (properties && properties.condition) {
            let currentCondition = properties.condition;
            properties.condition = (context: AbilityContext<this>) => context.source.isDire() && currentCondition(context);
        } else {
            properties = Object.assign({ condition: (context: AbilityContext<this>) => context.source.isDire() }, properties);
        }
        properties = Object.assign({ isKeywordEffect: true }, properties);

        this.persistentEffect(properties);
    }

    legendary(fate: number): void {
        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: [
                AbilityDsl.effects.playerCannot({
                    cannot: 'placeFateWhenPlayingCharacterFromProvince',
                    restricts: 'source'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'putIntoPlay',
                    restricts: 'cardEffects'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'placeFate'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'preventedFromLeavingPlay'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'enterPlay',
                    restricts: 'nonDynastyPhase'
                }),
                AbilityDsl.effects.legendaryFate(fate)
            ]
        });
    }

    isDire(): boolean {
        return false;
    }

    hasKeyword(keyword: string): boolean {
        const targetKeyword = keyword.toLowerCase();

        const addKeywordEffects = this.getEffects(EffectName.AddKeyword).filter(
            (effectValue: string) => effectValue === targetKeyword
        );
        const loseKeywordEffects = this.getEffects(EffectName.LoseKeyword).filter(
            (effectValue: string) => effectValue === targetKeyword
        );

        return addKeywordEffects.length > loseKeywordEffects.length;
    }

    hasPrintedKeyword(keyword: PrintedKeyword) {
        return this.printedKeywords.includes(keyword);
    }

    hasTrait(trait: string): boolean {
        return this.hasSomeTrait(trait);
    }

    hasEveryTrait(traits: Set<string>): boolean;
    hasEveryTrait(...traits: string[]): boolean;
    hasEveryTrait(traitSetOrFirstTrait: Set<string> | string, ...otherTraits: string[]): boolean {
        const traitsToCheck =
            traitSetOrFirstTrait instanceof Set
                ? traitSetOrFirstTrait
                : new Set([traitSetOrFirstTrait, ...otherTraits]);

        const cardTraits = this.getTraitSet();
        for (const trait of traitsToCheck) {
            if (!cardTraits.has(trait.toLowerCase())) {
                return false;
            }
        }
        return true;
    }

    hasSomeTrait(traits: Set<string>): boolean;
    hasSomeTrait(...traits: string[]): boolean;
    hasSomeTrait(traitSetOrFirstTrait: Set<string> | string, ...otherTraits: string[]): boolean {
        const traitsToCheck =
            traitSetOrFirstTrait instanceof Set
                ? traitSetOrFirstTrait
                : new Set([traitSetOrFirstTrait, ...otherTraits]);

        const cardTraits = this.getTraitSet();
        for (const trait of traitsToCheck) {
            if (cardTraits.has(trait.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    getTraits(): Set<string> {
        return this.getTraitSet();
    }

    getTraitSet(): Set<string> {
        const copiedCard = this.copiedCard;
        const set = new Set(
            copiedCard
                ? (copiedCard.traits as string[])
                : this.getEffects(EffectName.Blank).some((blankTraits: boolean) => blankTraits)
                    ? []
                    : this.traits
        );

        for (const gainedTrait of this.getEffects(EffectName.AddTrait)) {
            set.add(gainedTrait);
        }
        for (const lostTrait of this.getEffects(EffectName.LoseTrait)) {
            set.delete(lostTrait);
        }

        return set;
    }

    isFaction(faction: Faction): boolean {
        const cardFactions = this.getFactions();
        if (faction === 'neutral') {
            return cardFactions.has(faction) && cardFactions.size === 1;
        }
        return cardFactions.has(faction);
    }

    getFactions(): Set<Faction> {
        const copiedCard = this.copiedCard;
        const cardFaction = (copiedCard ? copiedCard.printedFaction : this.printedFaction) as Faction;
        const addedFactions = this.getEffects(EffectName.AddFaction) as Faction[];
        const lostFactions = this.getEffects(EffectName.LoseFaction) as Faction[];
        const factionArray = [...addedFactions, cardFaction].filter(faction => !lostFactions.includes(faction));

        return new Set(factionArray);
    }

    isInProvince(): boolean {
        return this.game.getProvinceArray().includes(this.location);
    }

    isInPlay(): boolean {
        if (this.isFacedown()) {
            return false;
        }
        if ([CardType.Holding, CardType.Province, CardType.Stronghold].includes(this.type)) {
            return this.isInProvince();
        }
        return this.location === Location.PlayArea;
    }

    applyAnyLocationPersistentEffects(): void {
        for (const effect of this.persistentEffects) {
            if (effect.location === Location.Any) {
                effect.ref = this.addEffectToEngine({ ...effect, location: effect.location });
            }
        }
    }

    leavesPlay(_destination?: string): void {
        this.tokens = {};
        this.#resetLimits();
        this.controller = this.owner;
        this.inConflict = false;
    }

    #resetLimits() {
        for (const action of this.abilities.actions) {
            action.limit.reset();
        }
        for (const reaction of this.abilities.reactions) {
            reaction.limit.reset();
        }
    }

    updateAbilityEvents(from: Location, to: Location, reset: boolean = true) {
        if (reset) {
            this.#resetLimits();
        }
        for (const reaction of this.reactions) {
            if (this.type === CardType.Event) {
                if (
                    to === Location.ConflictDeck ||
                    this.controller.isCardInPlayableLocation(this) ||
                    (this.controller.opponent && this.controller.opponent.isCardInPlayableLocation(this))
                ) {
                    reaction.registerEvents();
                } else {
                    reaction.unregisterEvents();
                }
            } else if (reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if (!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        }
    }

    updateEffects(from: Location, to: Location) {
        const activeLocations: Record<string, Location[]> = {
            'conflict discard pile': [Location.ConflictDiscardPile],
            'play area': [Location.PlayArea],
            province: this.game.getProvinceArray()
        };
        if (
            !activeLocations[Location.Provinces].includes(from) ||
            !activeLocations[Location.Provinces].includes(to)
        ) {
            this.removeLastingEffects();
        }
        this.updateStatusTokenEffects();
        for (const effect of this.persistentEffects) {
            if (effect.location === Location.Any) {
                continue;
            }
            const location = effect.location as Location;
            const locationEntry = activeLocations[location];
            if (locationEntry && locationEntry.includes(to) && !locationEntry.includes(from)) {
                effect.ref = this.addEffectToEngine({ ...effect, location });
            } else if (locationEntry && !locationEntry.includes(to) && locationEntry.includes(from)) {
                if (effect.ref) {
                    this.removeEffectFromEngine(effect.ref);
                }
                effect.ref = [];
            }
        }
    }

    updateEffectContexts() {
        for (const effect of this.persistentEffects) {
            if (effect.ref) {
                for (let e of effect.ref) {
                    e.refreshContext();
                }
            }
        }
    }

    moveTo(targetLocation: Location) {
        let originalLocation = this.location;
        let sameLocation = false;

        this.location = targetLocation;

        if (
            [Location.PlayArea, Location.ConflictDiscardPile, Location.DynastyDiscardPile, Location.Hand].includes(
                targetLocation
            )
        ) {
            this.facedown = false;
        }

        if (
            this.game.getProvinceArray().includes(originalLocation) &&
            this.game.getProvinceArray().includes(targetLocation)
        ) {
            sameLocation = true;
        }

        if (originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation, !sameLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent(EventName.OnCardMoved, {
                card: this,
                originalLocation: originalLocation,
                newLocation: targetLocation
            });
        }
    }

    canTriggerAbilities(context: AbilityContext, ignoredRequirements: string[] = []): boolean {
        return (
            this.isFaceup() &&
            (ignoredRequirements.includes('triggeringRestrictions') ||
                this.checkRestrictions('triggerAbilities', context))
        );
    }

    canInitiateKeywords(context: AbilityContext): boolean {
        return this.isFaceup() && this.checkRestrictions('initiateKeywords', context);
    }

    getModifiedLimitMax(player: Player, ability: CardAbility, max: number): number {
        const effects = this.getRawEffects().filter((effect: CardEffect) => effect.type === EffectName.IncreaseLimitOnAbilities);
        let total = max;
        effects.forEach((effect: CardEffect) => {
            const value = effect.getValue(this) as { applyingPlayer?: Player; targetAbility?: CardAbility };
            const applyingPlayer = value.applyingPlayer || effect.context.player;
            const targetAbility = value.targetAbility;
            if ((!targetAbility || targetAbility === ability) && applyingPlayer === player) {
                total++;
            }
        });

        const printedEffects = this.getRawEffects().filter(
            (effect: CardEffect) => effect.type === EffectName.IncreaseLimitOnPrintedAbilities
        );
        printedEffects.forEach((effect: CardEffect) => {
            const value = effect.getValue(this);
            if (ability.printedAbility && (value === true || value === ability) && effect.context.player === player) {
                total++;
            }
        });

        return total;
    }

    getMenu() {
        if (
            this.menu.length === 0 ||
            !this.game.manualMode ||
            ![...this.game.getProvinceArray(), Location.PlayArea].includes(this.location)
        ) {
            return undefined;
        }

        if (this.isFacedown()) {
            return [
                { command: 'click', text: 'Select Card' },
                { command: 'reveal', text: 'Reveal' }
            ];
        }

        const menu = [{ command: 'click', text: 'Select Card' }];
        if (this.location === Location.PlayArea || this.isProvince || this.isStronghold) {
            menu.push(...this.menu);
        }
        return menu;
    }

    isConflictProvince(): boolean {
        return false;
    }

    isInConflictProvince(): boolean {
        return false;
    }

    isInConflict(): boolean {
        return this.inConflict;
    }

    isAtHome(): boolean {
        return !this.inConflict;
    }

    bow(): void {
        this.bowed = true;
    }

    ready(): void {
        this.bowed = false;
    }

    isUnique(): boolean {
        return !!this.cardData.is_unique;
    }

    isBlank(): boolean {
        return this.anyEffect(EffectName.Blank) || this.anyEffect(EffectName.CopyCharacter) || this.anyEffect(EffectName.CopyProvince);
    }

    getPrintedFaction(): string {
        return this.cardData.clan ?? this.cardData.faction ?? '';
    }

    checkRestrictions(actionType: string, context: AbilityContext): boolean {
        let player = (context && context.player) || this.controller;
        let conflict = context && context.game && context.game.currentConflict;
        return (
            super.checkRestrictions(actionType, context) &&
            player.checkRestrictions(actionType, context) &&
            (!conflict || conflict.checkRestrictions(actionType, context))
        );
    }

    getTokenCount(type: string): number {
        return this.tokens[type] ?? 0;
    }

    addToken(type: string, number: number = 1): void {
        this.tokens[type] = this.getTokenCount(type) + number;
    }

    hasToken(type: string): boolean {
        return this.getTokenCount(type) > 0;
    }

    removeAllTokens(): void {
        let keys = Object.keys(this.tokens);
        keys.forEach((key) => this.removeToken(key, this.tokens[key]));
    }

    removeToken(type: string, number: number): void {
        this.tokens[type] -= number;

        if (this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if (this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    getActions(): BaseCardAbility[] {
        return this.actions.slice();
    }

    getReactions(): TriggeredAbility[] {
        return this.reactions.slice();
    }

    getProvinceStrengthBonus(): number {
        return 0;
    }

    getFate(): number {
        return 0;
    }

    readiesDuringReadyPhase(): boolean {
        return !this.anyEffect(EffectName.DoesNotReady);
    }

    hideWhenFacedown(): boolean {
        return !this.anyEffect(EffectName.CanBeSeenWhenFacedown);
    }

    createSnapshot() {
        return {};
    }

    parseKeywords(text: string) {
        const parsed = parseKeywordsFromText(text);
        this.printedKeywords = parsed.keywords;
        this.disguisedKeywordTraits = parsed.disguisedTraits;
        this.allowedAttachmentTraits = parsed.allowedAttachmentTraits;

        for (const keyword of this.printedKeywords) {
            this.persistentEffect({ effect: AbilityDsl.effects.addKeyword(keyword) });
        }
    }

    checkForIllegalAttachments(): boolean {
        return false;
    }

    mustAttachToRing() {
        return false;
    }

    /**
     * Checks whether an attachment can be played on a given card or ring.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(_card: BaseCard | Ring): boolean {

        return true;
    }

    /**
     * Checks 'no attachment' restrictions for this card when attempting to
     * attach the passed attachment card.
     */
    allowAttachment(attachment: BaseCard): boolean {
        if (this.allowedAttachmentTraits.some((trait) => attachment.hasTrait(trait))) {
            return true;
        }

        return this.isBlank() || this.allowedAttachmentTraits.length === 0;
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     *
     * `Ring` is in the signature only so `AttachToRingAction.canAffect` can call
     * `attachment.canAttach(ring)` without a cast — the base impl rejects rings.
     * Ring-attaching cards (e.g. `GreaterUnderstanding`) override this and pair
     * with `mustAttachToRing()`.
     */
    canAttach(parent?: BaseCard | Ring, properties = { ignoreType: false, controller: this.controller }) {
        if (!(parent instanceof BaseCard)) {
            return false;
        }

        if (
            parent.getType() !== CardType.Character ||
            (!properties.ignoreType && this.getType() !== CardType.Attachment)
        ) {
            return false;
        }

        const attachmentController = properties.controller ?? this.controller;
        for (const effect of this.getRawEffects()) {
            switch (effect.type) {
                case EffectName.AttachmentMyControlOnly: {
                    if (attachmentController !== parent.controller) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentOpponentControlOnly: {
                    if (attachmentController === parent.controller) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentUniqueRestriction: {
                    if (!parent.isUnique()) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentFactionRestriction: {
                    const factions = effect.getValue(this) as Faction[];
                    if (!factions.some((faction) => parent.isFaction(faction))) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentTraitRestriction: {
                    const traits = effect.getValue(this) as string[];
                    if (!traits.some((trait) => parent.hasTrait(trait))) {
                        return false;
                    }
                    break;
                }
                case EffectName.AttachmentCardCondition: {
                    const cardCondition = effect.getValue(this) as (card: BaseCard) => boolean;
                    if (!cardCondition(parent)) {
                        return false;
                    }
                    break;
                }
            }
        }
        return true;
    }


    get statusTokens(): StatusToken[] {
        return this.statusManager.statusTokens;
    }

    addStatusToken(tokenType: CharacterStatus | StatusToken) {
        this.statusManager.addStatusToken(tokenType);
    }
    removeStatusToken(tokenType: CharacterStatus | StatusToken) {
        this.statusManager.removeStatusToken(tokenType);
    }
    getStatusToken(tokenType: CharacterStatus) {
        return this.statusManager.getStatusToken(tokenType);
    }
    updateStatusTokenEffects() {
        this.statusManager.updateStatusTokenEffects();
    }
    get hasStatusTokens() {
        return this.statusManager.hasStatusTokens;
    }
    hasStatusToken(type: CharacterStatus) {
        return this.statusManager.hasStatusToken(type);
    }
    get isHonored() {
        return this.statusManager.isHonored;
    }
    honor() {
        this.statusManager.honor();
    }
    get isDishonored() {
        return this.statusManager.isDishonored;
    }
    dishonor() {
        this.statusManager.dishonor();
    }
    get isTainted() {
        return this.statusManager.isTainted;
    }
    taint() {
        this.statusManager.taint();
    }
    untaint() {
        this.statusManager.untaint();
    }
    makeOrdinary() {
        this.statusManager.makeOrdinary();
    }
    isOrdinary() {
        return this.statusManager.isOrdinary();
    }

    hasElementSymbols(): boolean {
        return false;
    }

    getPrintedElementSymbols(): ElementSymbolInfo[] {
        return [];
    }

    getCurrentElementSymbols(): ElementSymbol[] {
        const symbols = this.getPrintedElementSymbols();
        if (!this.isInPlay()) {
            return symbols.map((symbol) => new ElementSymbol(this.game, this, symbol));
        }
        let changeEffects = this.getRawEffects().filter((effect: CardEffect) => effect.type === EffectName.ReplacePrintedElement);
        changeEffects.forEach((effect: CardEffect) => {
            const newElement = (effect.value as EffectValue<ElementSymbolInfo>).value;
            let sym = symbols.find((a) => a.key === newElement.key);
            if (sym) {
                sym.element = newElement.element;
            }
        });
        const mapped: ElementSymbol[] = [];
        symbols.forEach((symbol) => {
            mapped.push(new ElementSymbol(this.game, this, symbol));
        });
        return mapped;
    }

    getCurrentElementSymbol(key: string) {
        const symbols = this.getCurrentElementSymbols();
        const symbol = symbols.find((a) => a.key === key);
        if (symbol) {
            return symbol.element;
        }
        return 'none';
    }

    public getShortSummary() {
        return {
            ...super.getShortSummary(),
            packId: this.packId
        };
    }

    public getShortSummaryForControls(activePlayer: Player) {
        if (this.isFacedown() && (activePlayer !== this.controller || this.hideWhenFacedown())) {
            return { facedown: true, isDynasty: this.isDynasty, isConflict: this.isConflict };
        }
        return super.getShortSummaryForControls(activePlayer);
    }

    private getAbilityLimitSummary(): Array<{ max: number; current: number; exhausted: boolean }> | undefined {
        if (!this.controller) {
            return undefined;
        }
        const seen = new Set();
        const limits: Array<{ max: number; current: number; exhausted: boolean }> = [];
        const gainedAbilities = this.getEffects(EffectName.GainAbility) as CardAction[];
        for (const ability of [...this.abilities.actions, ...this.abilities.reactions, ...gainedAbilities]) {
            const limit = ability.limit;
            if (!limit || seen.has(limit)) {
                continue;
            }
            seen.add(limit);
            if (limit.max !== undefined && isFinite(limit.max)) {
                const current = limit.currentForPlayer(this.controller);
                if (current > 0) {
                    limits.push({ max: limit.max, current, exhausted: limit.isAtMax(this.controller) });
                }
            }
        }
        return limits.length > 0 ? limits : undefined;
    }

    /**
     * Names of the players who can currently play this card from where it sits. Only meaningful
     * out of play — e.g. cards set aside by Favorable Alliance or stolen by Shachihoko Bay stay
     * in "removed from game" but remain playable for a while, and the client marks those.
     */
    getPlayableBy(): string[] | undefined {
        if (!PLAYABLE_OUT_OF_PLAY_LOCATIONS.has(this.location)) {
            return undefined;
        }

        const names = this.game
            .getPlayers()
            .filter((player) => player.isCardInPlayableLocation(this))
            .map((player) => player.name);

        return names.length > 0 ? names : undefined;
    }

    getSummary(activePlayer: Player, hideWhenFaceup: boolean): CardSummary {
        let isActivePlayer = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        // This is my facedown card, but I'm not allowed to look at it
        // OR This is not my card, and it's either facedown or hidden from me
        if (
            isActivePlayer
                ? this.isFacedown() && this.hideWhenFacedown()
                : this.isFacedown() || hideWhenFaceup || this.anyEffect(EffectName.HideWhenFaceUp)
        ) {
            let state = {
                controller: this.controller.getShortSummary(),
                menu: isActivePlayer ? this.getMenu() : undefined,
                facedown: true,
                inConflict: this.inConflict,
                location: this.location,
                uuid: isActivePlayer ? this.uuid : undefined
            };
            return Object.assign(state, selectionState);
        }

        let state = {
            id: this.cardData.id,
            controlled: this.owner !== this.controller,
            inConflict: this.inConflict,
            facedown: this.isFacedown(),
            location: this.location,
            menu: this.getMenu(),
            name: this.cardData.name,
            packId: this.packId,
            popupMenuText: this.popupMenuText,
            showPopup: this.showPopup,
            tokens: this.tokens,
            type: this.getType(),
            isDishonored: this.isDishonored,
            isHonored: this.isHonored,
            isTainted: !!this.isTainted,
            uuid: this.uuid,
            abilityLimits: this.getAbilityLimitSummary(),
            playableBy: this.getPlayableBy()
        };

        return Object.assign(state, selectionState);
    }
}

export default BaseCard;
