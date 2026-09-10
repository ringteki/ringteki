import { EffectValue } from './EffectValue.js';
import { AbilityType, CardType, Location, Phases, Stage } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { Faction } from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type CardAbility from '../CardAbility.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { MoveCardAction } from '../GameActions/MoveCardAction.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type Player from '../Player.js';

// Restriction predicates read ability/card internals (ability.card, ability.properties,
// card.printedCost) that live on subtypes — narrowed at the call sites via `as DrawCard` /
// `as CardAbility`.
type RestrictionCheck = (context: AbilityContext, effect: Restriction, card?: BaseCard) => boolean;
type RestrictionType = string | RestrictionCheck | (string | RestrictionCheck)[];

const checkRestrictions: Record<string, RestrictionCheck> = {
    abilitiesTriggeredByOpponents: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    adjacentCharacters: (context, effect) =>
        context.source.type === CardType.Character &&
        context.player.areLocationsAdjacent(context.source.location, effect.context.source.location),
    attachmentsWithSameClan: (context, effect, card) =>
        context.source.type === CardType.Attachment &&
        context.source.getPrintedFaction() !== 'neutral' &&
        !!card && card.isFaction(context.source.getPrintedFaction() as Faction),
    attackedProvince: (context) =>
        !!context.game.currentConflict?.getConflictProvinces().includes(context.source as ProvinceCard),
    attackedProvinceNonForced: (context) =>
        !!context.game.currentConflict?.getConflictProvinces().includes(context.source as ProvinceCard) &&
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    attackingCharacters: (context) =>
        !!context.game.currentConflict && context.source.type === CardType.Character && (context.source as DrawCard).isAttacking(),
    cardEffects: (context) =>
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        context.stage !== Stage.Cost &&
        [
            CardType.Event,
            CardType.Character,
            CardType.Holding,
            CardType.Attachment,
            CardType.Stronghold,
            CardType.Province,
            CardType.Role
        ].includes(context.source.type),
    ringEffects: (context) => (context.source.type as string) === 'ring',
    cardAndRingEffects: (context, effect) => checkRestrictions.cardEffects(context, effect) || checkRestrictions.ringEffects(context, effect),
    characters: (context) => context.source.type === CardType.Character,
    charactersWithNoFate: (context) => context.source.type === CardType.Character && context.source.getFate() === 0,
    copiesOfDiscardEvents: (context) =>
        context.source.type === CardType.Event &&
        context.player.conflictDiscardPile.some((card: DrawCard) => card.name === context.source.name),
    copiesOfX: (context, effect) => context.source.name === effect.params,
    events: (context) => context.source.type === CardType.Event,
    eventsWithSameClan: (context, effect, card) =>
        context.source.type === CardType.Event &&
        context.source.getPrintedFaction() !== 'neutral' &&
        !!card && card.isFaction(context.source.getPrintedFaction() as Faction),
    nonMonstrousEvents: (context) => context.source.type === CardType.Event && !context.source.hasTrait('monstrous'),
    nonDynastyPhase: (context) => context.game.currentPhase !== Phases.Dynasty,
    nonSpellEvents: (context) => context.source.type === CardType.Event && !context.source.hasTrait('spell'),
    opponentsAttachments: (context, effect) =>
        context.player &&
        context.player === getApplyingPlayer(effect).opponent &&
        context.source.type === CardType.Attachment,
    opponentsCardEffects: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [
            CardType.Event,
            CardType.Character,
            CardType.Holding,
            CardType.Attachment,
            CardType.Stronghold,
            CardType.Province,
            CardType.Role
        ].includes(context.source.type),
    opponentsProvinceEffects: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [CardType.Province].includes(context.source.type),
    opponentsEvents: (context, effect) =>
        context.player &&
        context.player === getApplyingPlayer(effect).opponent &&
        context.source.type === CardType.Event,
    opponentsRingEffects: (context, effect) =>
        context.player && context.player === getApplyingPlayer(effect).opponent && (context.source.type as string) === 'ring',
    opponentsCardAndRingEffects: (context, effect) =>
        checkRestrictions.opponentsCardEffects(context, effect) ||
        checkRestrictions.opponentsRingEffects(context, effect),
    opponentsTriggeredAbilities: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility(),
    opponentsTriggeredActionAbilities: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility() &&
        context.ability.abilityType === AbilityType.Action,
    opponentsCardAbilities: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isCardAbility(),
    opponentsCharacters: (context, effect) =>
        context.source.type === CardType.Character && context.source.controller === getApplyingPlayer(effect).opponent,
    opponentsCharacterAbilitiesWithLowerGlory: (context, effect) => {
        const parent = (effect.context.source as DrawCard).parent;
        return context.source.type === CardType.Character &&
            context.source.controller === getApplyingPlayer(effect).opponent &&
            !!parent && (context.source as DrawCard).glory < parent.glory;
    },
    provinces: (context) => context.source.type === CardType.Province,
    reactions: (context) => context.ability.abilityType === AbilityType.Reaction,
    actionEvents: (context) =>
        (context.ability as CardAbility).card.type === CardType.Event && context.ability.abilityType === AbilityType.Action,
    source: (context, effect) => context.source === effect.context.source,
    keywordAbilities: (context) => context.ability.isKeywordAbility(),
    nonKeywordAbilities: (context) => !context.ability.isKeywordAbility(),
    nonForcedAbilities: (context) =>
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    equalOrMoreExpensiveCharacterTriggeredAbilities: (context, effect, card) =>
        context.source.type === CardType.Character &&
        !context.ability.isKeywordAbility() &&
        !!card && ((context.source as DrawCard).printedCost ?? 0) >= ((card as DrawCard).printedCost ?? 0),
    equalOrMoreExpensiveCharacterKeywords: (context, effect, card) =>
        context.source.type === CardType.Character &&
        context.ability.isKeywordAbility() &&
        !!card && ((context.source as DrawCard).printedCost ?? 0) >= ((card as DrawCard).printedCost ?? 0),
    eventPlayedByHigherBidPlayer: (context, effect, card) =>
        context.source.type === CardType.Event && !!card && context.player.showBid > card.controller.showBid,
    toHand: (context) => {
        const properties = (context.ability as CardAbility).properties;
        let targetActions: GameAction[] = properties.target?.gameAction
            ? (Array.isArray(properties.target.gameAction) ? properties.target.gameAction : [properties.target.gameAction])
            : [];
        let nestedActions = context.ability.gameAction
            ? context.ability.gameAction.map((topAction: GameAction) => (topAction.properties as { gameAction?: unknown }).gameAction)
            : [];

        return targetActions.some(isMoveToHandAction) || nestedActions.some(isMoveToHandAction);
    },
    loseHonorAsCost: (context) => context.stage === Stage.Cost,
    unopposedHonorLoss: (context) => context.source.name === 'Framework effect',
    // Darbuka of Banishment restricts Spells only, so anything else keeps its affinity.
    unlessMeishodo: (context) =>
        !!context.source && context.source.hasTrait('spell') && !context.source.hasTrait('meishodo')
};

const getApplyingPlayer = (effect: Restriction): Player => {
    return effect.applyingPlayer || effect.context.player;
};

const isMoveToHandAction = (gameAction: unknown) =>
    // @ts-expect-error -- properties.destination exists on MoveCardAction but not on the base type
    gameAction instanceof MoveCardAction && gameAction.properties.destination === Location.Hand;

const leavePlayTypes = new Set(['discardFromPlay', 'sacrifice', 'returnToHand', 'returnToDeck', 'removeFromGame']);

export interface RestrictionProperties {
    type?: string;
    restricts?: RestrictionType;
    applyingPlayer?: Player;
    params?: unknown;
    cannot?: RestrictionType;
}

class Restriction extends EffectValue<Restriction | undefined> {
    type?: string;
    restriction!: RestrictionType;
    applyingPlayer!: Player;
    params: unknown;

    constructor(properties: string | RestrictionProperties) {
        super(undefined);
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.type;
            this.restriction = properties.restricts as RestrictionType;
            this.applyingPlayer = properties.applyingPlayer as Player;
            this.params = properties.params;
        }
    }

    getValue() {
        return this;
    }

    isMatch(type: string, context: AbilityContext, card?: BaseCard): boolean {
        if(this.type === 'leavePlay') {
            return leavePlayTypes.has(type) && this.checkCondition(context, card);
        }

        return (!this.type || this.type === type) && this.checkCondition(context, card);
    }

    checkCondition(context: AbilityContext, card?: BaseCard): boolean {
        const restriction = this.restriction;
        if(Array.isArray(restriction)) {
            const vals = restriction.map((a) => this.checkRestriction(a, context, card));
            return vals.every((a: boolean) => a);
        }

        return this.checkRestriction(restriction, context, card);
    }

    checkRestriction(restriction: string | RestrictionCheck | undefined, context: AbilityContext, card?: BaseCard): boolean {
        if(!restriction) {
            return true;
        } else if(!context) {
            throw new Error('checkCondition called without a context');
        } else if(typeof restriction === 'function') {
            return restriction(context, this, card);
        } else if(!checkRestrictions[restriction]) {
            return context.source.hasTrait(restriction);
        }
        return checkRestrictions[restriction](context, this, card);
    }
}

export default Restriction;
