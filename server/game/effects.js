const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CopyCharacter = require('./Effects/CopyCharacter');
const GainAllAbiliites = require('./Effects/GainAllAbilities.js');
const Restriction = require('./Effects/restriction.js');
const SuppressEffect = require('./Effects/SuppressEffect');
const GainAbility = require('./Effects/GainAbility');
const EffectBuilder = require('./Effects/EffectBuilder');
const { EffectNames, PlayTypes, CardTypes, Players } = require('./Constants');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    // Card effects
    addElementAsAttacker: (element) => EffectBuilder.card.flexible(EffectNames.AddElementAsAttacker, element),
    addFaction: (faction) => EffectBuilder.card.static(EffectNames.AddFaction, faction),
    addKeyword: (keyword) => EffectBuilder.card.static(EffectNames.AddKeyword, keyword),
    addTrait: (trait) => EffectBuilder.card.static(EffectNames.AddTrait, trait),
    attachmentFactionRestriction: (factions) => EffectBuilder.card.static(EffectNames.AttachmentFactionRestriction, factions),
    attachmentLimit: (amount) => EffectBuilder.card.static(EffectNames.AttachmentLimit, amount),
    attachmentMyControlOnly: () => EffectBuilder.card.static(EffectNames.AttachmentMyControlOnly),
    attachmentRestrictTraitAmount: (object) => EffectBuilder.card.static(EffectNames.AttachmentRestrictTraitAmount, object),
    attachmentTraitRestriction: (traits) => EffectBuilder.card.static(EffectNames.AttachmentTraitRestriction, traits),
    attachmentUniqueRestriction: () => EffectBuilder.card.static(EffectNames.AttachmentUniqueRestriction),
    blank: (blankTraits = false) => EffectBuilder.card.static(EffectNames.Blank, blankTraits),
    calculatePrintedMilitarySkill: (func) => EffectBuilder.card.static(EffectNames.CalculatePrintedMilitarySkill, func),
    canPlayFromOutOfPlay: (player, playType = PlayTypes.PlayFromHand) => EffectBuilder.card.flexible(EffectNames.CanPlayFromOutOfPlay, Object.assign({ player: player, playType: playType })),
    canBeSeenWhenFacedown: () => EffectBuilder.card.static(EffectNames.CanBeSeenWhenFacedown),
    canBeTriggeredByOpponent: () => EffectBuilder.card.static(EffectNames.CanBeTriggeredByOpponent),
    canOnlyBeDeclaredAsAttackerWithElement: (element) => EffectBuilder.card.flexible(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement, element),
    cannotApplyLastingEffects: (condition) => EffectBuilder.card.static(EffectNames.CannotApplyLastingEffects, condition),
    cannotBeAttacked: () => EffectBuilder.card.static(EffectNames.CannotBeAttacked),
    cannotHaveConflictsDeclaredOfType: (type) => EffectBuilder.card.flexible(EffectNames.CannotHaveConflictsDeclaredOfType, type),
    cannotHaveOtherRestrictedAttachments: card => EffectBuilder.card.static(EffectNames.CannotHaveOtherRestrictedAttachments, card),
    cannotParticipateAsAttacker: (type = 'both') => EffectBuilder.card.static(EffectNames.CannotParticipateAsAttacker, type),
    cannotParticipateAsDefender: (type = 'both') => EffectBuilder.card.static(EffectNames.CannotParticipateAsDefender, type),
    cardCannot: (properties) => EffectBuilder.card.static(EffectNames.AbilityRestrictions, new Restriction(Object.assign({ type: properties.cannot || properties }, properties))),
    changeContributionFunction: (func) => EffectBuilder.card.static(EffectNames.ChangeContributionFunction, func),
    changeType: (type) => EffectBuilder.card.static(EffectNames.ChangeType, type),
    characterProvidesAdditionalConflict: (type) => EffectBuilder.card.detached(EffectNames.AdditionalConflict, {
        apply: card => card.controller.addConflictOpportunity(type),
        unapply: card => card.controller.removeConflictOpportunity(type)
    }),
    contributeToConflict: (player) => EffectBuilder.card.flexible(EffectNames.ContributeToConflict, player),
    copyCharacter: (character) => EffectBuilder.card.static(EffectNames.CopyCharacter, new CopyCharacter(character)),
    customDetachedCard: (properties) => EffectBuilder.card.detached(EffectNames.CustomEffect, properties),
    customRefillProvince: (refillFunc) => EffectBuilder.card.static(EffectNames.CustomProvinceRefillEffect, refillFunc), //refillFunc: (Player, ProvinceCard) => { }
    delayedEffect: (properties) => EffectBuilder.card.static(EffectNames.DelayedEffect, properties),
    doesNotBow: () => EffectBuilder.card.static(EffectNames.DoesNotBow),
    doesNotReady: () => EffectBuilder.card.static(EffectNames.DoesNotReady),
    entersPlayWithStatus: (status) => EffectBuilder.card.static(EffectNames.EntersPlayWithStatus, status),
    entersPlayForOpponent: () => EffectBuilder.card.static(EffectNames.EntersPlayForOpponent),
    fateCostToAttack: (amount = 1) => EffectBuilder.card.flexible(EffectNames.FateCostToAttack, amount),
    fateCostToRingToDeclareConflictAgainst: (amount = 1) => EffectBuilder.card.flexible(EffectNames.FateCostToRingToDeclareConflictAgainst, amount),
    fateCostToTarget: (properties) => EffectBuilder.card.flexible(EffectNames.FateCostToTarget, properties),
    gainAbility: (abilityType, properties) => EffectBuilder.card.static(EffectNames.GainAbility, new GainAbility(abilityType, properties)),
    gainAllAbilities: (character) => EffectBuilder.card.static(EffectNames.GainAllAbilities, new GainAllAbiliites(character)),
    gainExtraFateWhenPlayed: (amount = 1) => EffectBuilder.card.flexible(EffectNames.GainExtraFateWhenPlayed, amount),
    gainPlayAction: (playActionClass) => EffectBuilder.card.detached(EffectNames.GainPlayAction, {
        apply: card => {
            let action = new playActionClass(card);
            card.abilities.playActions.push(action);
            return action;
        },
        unapply: (card, context, playAction) => card.abilities.playActions = card.abilities.playActions.filter(action => action !== playAction)
    }),
    hideWhenFaceUp: () => EffectBuilder.card.static(EffectNames.HideWhenFaceUp),
    honorStatusDoesNotAffectLeavePlay: () => EffectBuilder.card.flexible(EffectNames.HonorStatusDoesNotAffectLeavePlay),
    honorStatusDoesNotModifySkill: () => EffectBuilder.card.flexible(EffectNames.HonorStatusDoesNotModifySkill),
    honorStatusReverseModifySkill: () => EffectBuilder.card.flexible(EffectNames.HonorStatusReverseModifySkill),
    immunity: (properties) => EffectBuilder.card.static(EffectNames.AbilityRestrictions, new Restriction(properties)),
    increaseLimitOnAbilities: (abilities) => EffectBuilder.card.static(EffectNames.IncreaseLimitOnAbilities, abilities),
    loseKeyword: (keyword) => EffectBuilder.card.static(EffectNames.LoseKeyword, keyword),
    modifyBaseMilitarySkillMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBaseMilitarySkillMultiplier, value),
    modifyBasePoliticalSkillMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBasePoliticalSkillMultiplier, value),
    modifyBaseProvinceStrength: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBaseProvinceStrength, value),
    modifyBothSkills: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBothSkills, value),
    modifyGlory: (value) => EffectBuilder.card.flexible(EffectNames.ModifyGlory, value),
    modifyMilitarySkill: (value) => EffectBuilder.card.flexible(EffectNames.ModifyMilitarySkill, value),
    attachmentMilitarySkillModifier: (value) => EffectBuilder.card.flexible(EffectNames.AttachmentMilitarySkillModifier, value),
    modifyMilitarySkillMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyMilitarySkillMultiplier, value),
    modifyPoliticalSkill: (value) => EffectBuilder.card.flexible(EffectNames.ModifyPoliticalSkill, value),
    attachmentPoliticalSkillModifier: (value) => EffectBuilder.card.flexible(EffectNames.AttachmentPoliticalSkillModifier, value),
    modifyPoliticalSkillMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyPoliticalSkillMultiplier, value),
    modifyProvinceStrength: (value) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrength, value),
    modifyProvinceStrengthMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrengthMultiplier, value),
    modifyProvinceStrengthBonus: (value) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrengthBonus, value),
    mustBeChosen: (properties) => EffectBuilder.card.static(EffectNames.MustBeChosen, new Restriction(Object.assign({ type: 'target' }, properties))),
    mustBeDeclaredAsAttacker: (type = 'both') => EffectBuilder.card.static(EffectNames.MustBeDeclaredAsAttacker, type),
    mustBeDeclaredAsDefender: (type = 'both') => EffectBuilder.card.static(EffectNames.MustBeDeclaredAsDefender, type),
    refillProvinceTo: (refillAmount) => EffectBuilder.card.flexible(EffectNames.RefillProvinceTo, refillAmount),
    setBaseDash: (type) => EffectBuilder.card.static(EffectNames.SetBaseDash, type),
    setBaseMilitarySkill: (value) => EffectBuilder.card.static(EffectNames.SetBaseMilitarySkill, value),
    setBasePoliticalSkill: (value) => EffectBuilder.card.static(EffectNames.SetBasePoliticalSkill, value),
    setBaseProvinceStrength: (value) => EffectBuilder.card.static(EffectNames.SetBaseProvinceStrength, value),
    setDash: (type) => EffectBuilder.card.static(EffectNames.SetDash, type),
    setGlory: (value) => EffectBuilder.card.static(EffectNames.SetGlory, value),
    setBaseGlory: (value) => EffectBuilder.card.static(EffectNames.SetBaseGlory, value),
    setMilitarySkill: (value) => EffectBuilder.card.static(EffectNames.SetMilitarySkill, value),
    setPoliticalSkill: (value) => EffectBuilder.card.static(EffectNames.SetPoliticalSkill, value),
    setProvinceStrength: (value) => EffectBuilder.card.static(EffectNames.SetProvinceStrength, value),
    setProvinceStrengthBonus: (value) => EffectBuilder.card.flexible(EffectNames.SetProvinceStrengthBonus, value),
    switchBaseSkills: () => EffectBuilder.card.static(EffectNames.SwitchBaseSkills),
    suppressEffects: (condition) => EffectBuilder.card.static(EffectNames.SuppressEffects, new SuppressEffect(condition)),
    takeControl: (player) => EffectBuilder.card.static(EffectNames.TakeControl, player),
    unlessActionCost: (properties) => EffectBuilder.card.static(EffectNames.UnlessActionCost, properties),
    // Ring effects
    addElement: (element) => EffectBuilder.ring.flexible(EffectNames.AddElement, element),
    cannotBidInDuels: num => EffectBuilder.player.static(EffectNames.CannotBidInDuels, num),
    cannotDeclareRing: (match) => EffectBuilder.ring.static(EffectNames.CannotDeclareRing, match),
    considerRingAsClaimed: (match) => EffectBuilder.ring.static(EffectNames.ConsiderRingAsClaimed, match),
    // Player effects
    additionalAction: (amount = 1) => EffectBuilder.player.static(EffectNames.AdditionalAction, amount),
    additionalCardPlayed: (amount = 1) => EffectBuilder.player.flexible(EffectNames.AdditionalCardPlayed, amount),
    additionalCharactersInConflict: (amount) => EffectBuilder.player.flexible(EffectNames.AdditionalCharactersInConflict, amount),
    additionalConflict: (type) => EffectBuilder.player.static(EffectNames.AdditionalConflict, type),
    additionalTriggerCost: (func) => EffectBuilder.player.static(EffectNames.AdditionalTriggerCost, func),
    additionalPlayCost: (func) => EffectBuilder.player.static(EffectNames.AdditionalPlayCost, func),
    alternateFatePool: (match) => EffectBuilder.player.static(EffectNames.AlternateFatePool, match),
    cannotDeclareConflictsOfType: type => EffectBuilder.player.static(EffectNames.CannotDeclareConflictsOfType, type),
    canPlayFromOwn: (location, cards, playType = PlayTypes.PlayFromHand) => EffectBuilder.player.detached(EffectNames.CanPlayFromOwn, {
        apply: (player) => {
            for(const card of cards.filter(card => card.type === CardTypes.Event && card.location === location)) {
                for(const reaction of card.reactions) {
                    reaction.registerEvents();
                }
            }
            return player.addPlayableLocation(playType, player, location, cards);
        },
        unapply: (player, context, location) => player.removePlayableLocation(location)
    }),
    canPlayFromOpponents: (location, cards, playType = PlayTypes.PlayFromHand) => EffectBuilder.player.detached(EffectNames.CanPlayFromOpponents, {
        apply: (player) => {
            if(!player.opponent) {
                return;
            }
            for(const card of cards.filter(card => card.type === CardTypes.Event && card.location === location)) {
                for(const reaction of card.reactions) {
                    reaction.registerEvents();
                }
            }
            return player.addPlayableLocation(playType, player.opponent, location, cards);
        },
        unapply: (player, context, location) => player.removePlayableLocation(location)
    }),
    limitHonorGainPerPhase: (amount) => EffectBuilder.player.static(EffectNames.LimitHonorGainPerPhase, amount),
    cannotResolveRings: () => EffectBuilder.player.static(EffectNames.CannotResolveRings),
    changePlayerGloryModifier: (value) => EffectBuilder.player.static(EffectNames.ChangePlayerGloryModifier, value),
    changePlayerSkillModifier: (value) => EffectBuilder.player.flexible(EffectNames.ChangePlayerSkillModifier, value),
    customDetachedPlayer: (properties) => EffectBuilder.player.detached(EffectNames.CustomEffect, properties),
    gainActionPhasePriority: () => EffectBuilder.player.detached(EffectNames.GainActionPhasePriority, {
        apply: player => player.actionPhasePriority = true,
        unapply: player => player.actionPhasePriority = false
    }),
    increaseCost: (properties) => Effects.reduceCost(_.extend(properties, { amount: -properties.amount })),
    modifyCardsDrawnInDrawPhase: (amount) => EffectBuilder.player.flexible(EffectNames.ModifyCardsDrawnInDrawPhase, amount),
    playerCannot: (properties) => EffectBuilder.player.static(EffectNames.AbilityRestrictions, new Restriction(Object.assign({ type: properties.cannot || properties }, properties))),
    playerDelayedEffect: (properties) => EffectBuilder.player.static(EffectNames.DelayedEffect, properties),
    reduceCost: (properties) => EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (player, context) => player.addCostReducer(context.source, properties),
        unapply: (player, context, reducer) => player.removeCostReducer(reducer)
    }),
    reduceNextPlayedCardCost: (amount, match) => EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (player, context) => player.addCostReducer(context.source, { amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
        unapply: (player, context, reducer) => player.removeCostReducer(reducer)
    }),
    setConflictDeclarationType: (type) => EffectBuilder.player.static(EffectNames.SetConflictDeclarationType, type),
    setMaxConflicts: (amount) => EffectBuilder.player.static(EffectNames.SetMaxConflicts, amount),
    setConflictTotalSkill: (value) => EffectBuilder.player.static(EffectNames.SetConflictTotalSkill, value),
    showTopConflictCard: (players = Players.Any) => EffectBuilder.player.static(EffectNames.ShowTopConflictCard, players),
    showTopDynastyCard: () => EffectBuilder.player.static(EffectNames.ShowTopDynastyCard),
    eventsCannotBeCancelled: () => EffectBuilder.player.static(EffectNames.EventsCannotBeCancelled),
    mustDeclareMaximumAttackers: (type = 'both') => EffectBuilder.player.static(EffectNames.MustDeclareMaximumAttackers, type),
    restartDynastyPhase: (source) => EffectBuilder.player.static(EffectNames.RestartDynastyPhase, source),
    strongholdCanBeAttacked: () => EffectBuilder.player.static(EffectNames.StrongholdCanBeAttacked),
    defendersChosenFirstDuringConflict: (amountOfAttackers) => EffectBuilder.player.static(EffectNames.DefendersChosenFirstDuringConflict, amountOfAttackers),
    // Conflict effects
    cannotContribute: (func) => EffectBuilder.conflict.dynamic(EffectNames.CannotContribute, func),
    changeConflictSkillFunction: (func) => EffectBuilder.conflict.static(EffectNames.ChangeConflictSkillFunction, func), // TODO: Add this to lasting effect checks
    modifyConflictElementsToResolve: (value) => EffectBuilder.conflict.static(EffectNames.ModifyConflictElementsToResolve, value), // TODO: Add this to lasting effect checks
    restrictNumberOfDefenders: (value) => EffectBuilder.conflict.static(EffectNames.RestrictNumberOfDefenders, value), // TODO: Add this to lasting effect checks
    resolveConflictEarly: () => EffectBuilder.player.static(EffectNames.ResolveConflictEarly),
    forceConflictUnopposed: () => EffectBuilder.conflict.static(EffectNames.ForceConflictUnopposed)
};

module.exports = Effects;
