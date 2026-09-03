import type { CardType, ConflictType, Element, Players, PlayType } from '../Constants.js';
import { EffectName } from '../Constants.js';
import type Player from '../Player.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';
import type { GameObject } from '../GameObject.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type { Cost } from '../costs/Cost.js';

// Structural view of Restriction (consumers only call `.isMatch`); `card?: GameObject` so the
// base GameObject.checkRestrictions can pass `this` without a downcast (isMatch's method params
// are bivariant, so a real Restriction still satisfies this).
type RestrictionLike = { isMatch(type: string, context: AbilityContext, card?: GameObject): boolean };
import type { AttachmentMilitarySkillModifierValue } from './Library/attachmentMilitarySkillModifier.js';
import type { AttachmentPoliticalSkillModifierValue } from './Library/attachmentPoliticalSkillModifier.js';

export type FatePool = DrawCard | Ring;

export interface ParticipantCost {
    hasLegalTarget(context: AbilityContext): boolean;
    resolve(player: Player, context: AbilityContext): void;
    getEffectMessage(context: AbilityContext): string;
}

export interface ParticipantCostEffect {
    type: string;
    cost: ParticipantCost | ((player: Player) => ParticipantCost);
    message?: string;
}

/**
 * FOUNDATION (in progress — multi-turn effort): maps each EffectName to the *resolved* value type
 * that `getEffects(name)` should yield (i.e. the type after a Flexible/dynamic effect has been
 * evaluated — `modifyMilitarySkill` resolves to `number`, not `number | fn`).
 *
 * Why this exists: `EffectBuilder` widens every value to `unknown` and every name to `EffectName`,
 * so the per-effect value type can't be recovered from `typeof Effects`. This map is the single
 * source of truth that `getEffects`/`StaticEffect`/`EffectValue` will be typed against, replacing
 * the `any` that currently flows through the whole effect system (~92 consumer sites).
 *
 * Status: the numeric / boolean / string / enum effects below are filled and correct against
 * `effects.ts`. Everything else falls through the `[name: string]: unknown` default and will be
 * tightened in subsequent batches. NOT yet wired into `getEffects` — wiring is the cascading batch
 * that retypes all consumers at once.
 *
 * Gotchas discovered while authoring (these names are reused by multiple factories with DIFFERENT
 * value types, so their entries are unions / left as the consumer-relevant type):
 *   - AdditionalConflict: `string` (from `additionalConflict`) but also a detached fn effect
 *     (`characterProvidesAdditionalConflict`). Consumers treat it as `string`, so typed `string`.
 *   - CustomEffect, AbilityRestrictions, DelayedEffect, CanPlayFromOutOfPlay, AdditionalTriggerCost,
 *     ChangeConflictSkillFunction — reused across card/player/detached factories; left as `unknown`
 *     pending dedicated types.
 */
export interface EffectValueMap {
    [name: string]: unknown;

    [EffectName.CostToDeclareAnyParticipants]: ParticipantCostEffect;

    // --- numeric (resolved value is a number) ---
    [EffectName.AttachmentLimit]: number;
    [EffectName.FateCostToAttack]: number;
    [EffectName.CardCostToAttackMilitary]: number;
    [EffectName.FateCostToRingToDeclareConflictAgainst]: number;
    [EffectName.GainExtraFateWhenPlayed]: number;
    [EffectName.LegendaryFate]: number;
    [EffectName.ModifyBaseMilitarySkillMultiplier]: number;
    [EffectName.ModifyBasePoliticalSkillMultiplier]: number;
    [EffectName.ModifyBaseProvinceStrength]: number;
    [EffectName.ModifyBothSkills]: number;
    [EffectName.ModifyGlory]: number;
    [EffectName.ModifyMilitarySkill]: number;
    [EffectName.ModifyMilitarySkillMultiplier]: number;
    [EffectName.ModifyPoliticalSkill]: number;
    [EffectName.ModifyPoliticalSkillMultiplier]: number;
    [EffectName.ModifyProvinceStrength]: number;
    [EffectName.ModifyProvinceStrengthMultiplier]: number;
    [EffectName.ModifyProvinceStrengthBonus]: number;
    [EffectName.ModifyRestrictedAttachmentAmount]: number;
    [EffectName.RefillProvinceTo]: number;
    [EffectName.SetApparentFate]: number;
    [EffectName.SetBaseMilitarySkill]: number;
    [EffectName.SetBasePoliticalSkill]: number;
    [EffectName.SetBaseProvinceStrength]: number;
    [EffectName.SetGlory]: number;
    [EffectName.SetBaseGlory]: number;
    [EffectName.SetMilitarySkill]: number;
    [EffectName.SetPoliticalSkill]: number;
    [EffectName.SetProvinceStrength]: number;
    [EffectName.SetProvinceStrengthBonus]: number;
    [EffectName.AdditionalAction]: number;
    [EffectName.AdditionalCardPlayed]: number;
    [EffectName.AdditionalCharactersInConflict]: number;
    [EffectName.LimitHonorGainPerPhase]: number;
    [EffectName.ModifyHonorTransferGiven]: number;
    [EffectName.ModifyHonorTransferReceived]: number;
    [EffectName.ChangePlayerSkillModifier]: number;
    [EffectName.ModifyCardsDrawnInDrawPhase]: number;
    [EffectName.SetMaxConflicts]: number;
    [EffectName.SetConflictTotalSkill]: number;
    [EffectName.DefendersChosenFirstDuringConflict]: number;
    [EffectName.AdditionalActionAfterWindowCompleted]: number;
    [EffectName.ModifyConflictElementsToResolve]: number;
    [EffectName.RestrictNumberOfDefenders]: number;
    [EffectName.ModifyUnopposedHonorLoss]: number;

    // --- boolean (resolved value is a flag) ---
    [EffectName.AttachmentMyControlOnly]: boolean;
    [EffectName.AttachmentOpponentControlOnly]: boolean;
    [EffectName.AttachmentUniqueRestriction]: boolean;
    [EffectName.Blank]: boolean;
    [EffectName.CanBeSeenWhenFacedown]: boolean;
    [EffectName.CanBeTriggeredByOpponent]: boolean;
    [EffectName.CannotBeAttacked]: boolean;
    [EffectName.DoesNotBow]: boolean;
    [EffectName.DoesNotReady]: boolean;
    [EffectName.EntersPlayForOpponent]: boolean;
    [EffectName.HideWhenFaceUp]: boolean;
    [EffectName.HonorStatusDoesNotAffectLeavePlay]: boolean;
    [EffectName.HonorStatusDoesNotModifySkill]: boolean;
    [EffectName.TaintedStatusDoesNotCostHonor]: boolean;
    [EffectName.HonorStatusReverseModifySkill]: boolean;
    [EffectName.LoseAllNonKeywordAbilities]: boolean;
    [EffectName.SwitchBaseSkills]: boolean;
    [EffectName.WinDuelTies]: boolean;
    [EffectName.IgnoreDuelSkill]: boolean;
    [EffectName.PayPrintedCostToOpponent]: boolean;
    [EffectName.CannotResolveRings]: boolean;
    [EffectName.ShowTopDynastyCard]: boolean;
    [EffectName.EventsCannotBeCancelled]: boolean;
    [EffectName.StrongholdCanBeAttacked]: boolean;
    [EffectName.ConsideredLessHonorable]: boolean;
    [EffectName.ResolveConflictEarly]: boolean;
    [EffectName.ForceConflictUnopposed]: boolean;
    [EffectName.ConflictIgnoreStatusTokens]: boolean;
    [EffectName.ApplyStatusTokensToDuel]: boolean;
    [EffectName.DuelIgnorePrintedSkill]: boolean;

    // --- string (faction/keyword/trait/conflict-type names) ---
    [EffectName.AddElementAsAttacker]: Element | Element[];
    [EffectName.AddFlag]: string;
    [EffectName.AddFaction]: string;
    [EffectName.LoseFaction]: string;
    [EffectName.AddKeyword]: string;
    [EffectName.AddTrait]: string;
    [EffectName.CanOnlyBeDeclaredAsAttackerWithElement]: Element;
    [EffectName.CannotHaveConflictsDeclaredOfType]: string;
    [EffectName.CannotParticipateAsAttacker]: string;
    [EffectName.CannotParticipateAsDefender]: string;
    [EffectName.LoseKeyword]: string;
    [EffectName.LoseTrait]: string;
    [EffectName.MustBeDeclaredAsAttackerIfType]: string;
    [EffectName.MustBeDeclaredAsAttacker]: string;
    [EffectName.MustBeDeclaredAsDefender]: string;
    [EffectName.MustDeclareMaximumAttackers]: string;
    [EffectName.EntersPlayWithStatus]: 'honored' | 'ordinary' | 'dishonored';
    [EffectName.CannotDeclareConflictsOfType]: string;
    [EffectName.SetConflictDeclarationType]: ConflictType;
    [EffectName.ProvideConflictDeclarationType]: ConflictType;
    [EffectName.ForceConflictDeclarationType]: ConflictType;
    [EffectName.AdditionalConflict]: string;

    // --- enum-valued ---
    [EffectName.ChangeType]: CardType;
    [EffectName.ShowTopConflictCard]: Players;
    [EffectName.CannotBidInDuels]: number | string;

    // --- object/instance-valued (confident from consumer usage) ---
    [EffectName.ContributeToConflict]: Player; // Conflict compares it `=== defendingPlayer`
    [EffectName.SatisfyAffinity]: string | string[]; // Player.hasAffinity reads it as trait(s)
    [EffectName.AbilityRestrictions]: RestrictionLike; // consumers call `.isMatch(...)`
    [EffectName.MustBeChosen]: RestrictionLike; // `new Restriction({ type: 'target' })`
    [EffectName.AddElement]: Element; // Ring concats these into Element[]

    // --- instance/Player-valued ---
    [EffectName.CopyCharacter]: DrawCard; // the copied card; consumers read printed* / traits
    [EffectName.CopyProvince]: ProvinceCard; // the copied card; consumers read printed* / traits
    [EffectName.TakeControl]: Player;
    [EffectName.ChangePlayerGloryModifier]: number;

    // --- composite-valued (multiple values) ---
    [EffectName.HonorCostToDeclare]: { amount: number, dueToStatusToken?: boolean };

    // --- function-valued (predicate / match / cost functions; typed against consumer call sites) ---
    [EffectName.CannotDeclareRing]: (player: Player) => boolean;
    [EffectName.ConsiderRingAsClaimed]: (player: Player) => boolean;
    [EffectName.CanPlayFromOutOfPlay]: { player: (player: Player, card: BaseCard) => boolean; playType?: PlayType };
    [EffectName.CannotContribute]: (card: BaseCard) => boolean;
    [EffectName.CannotApplyLastingEffects]: (effect: unknown) => boolean;
    [EffectName.AlternateFatePool]: (card: DrawCard) => FatePool;
    [EffectName.ChangeConflictSkillFunction]: (card: BaseCard, conflict?: unknown) => number;
    [EffectName.ChangeContributionFunction]: (card: DrawCard) => number;
    [EffectName.CustomProvinceRefillEffect]: (player: Player, province?: BaseCard) => void;
    [EffectName.CustomFatePhaseFateRemoval]: (player: Player, numFate: number) => void;
    [EffectName.AttachmentMilitarySkillModifier]: AttachmentMilitarySkillModifierValue;
    [EffectName.AttachmentPoliticalSkillModifier]: AttachmentPoliticalSkillModifierValue;
    [EffectName.PlayerFateCostToTargetCard]: { match: (card: BaseCard) => boolean; amount: number };
    [EffectName.FateCostToTarget]: { cardType?: string; targetPlayer?: Players; amount: number };
    [EffectName.AttachmentRestrictTraitAmount]: Record<string, number>;
    [EffectName.AdditionalAttackedProvince]: ProvinceCard;
    [EffectName.AdditionalTriggerCost]: (context: AbilityContext) => Cost | Cost[];
    [EffectName.AdditionalPlayCost]: (context: AbilityContext) => Cost | Cost[];
    [EffectName.CanOnlyBeDeclaredAsAttackerWithCondition]: ((props: ICanOnlyBeDeclaredAsAttackerWithCondition) => boolean);
}

export interface ICanOnlyBeDeclaredAsAttackerWithCondition {
    context: AbilityContext,
    conflictType: string,
    ring: Ring,
    province?: ProvinceCard | null,
    incomingAttackers?: DrawCard[]
}
