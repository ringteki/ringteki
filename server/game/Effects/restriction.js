const EffectValue = require('./EffectValue');

const { AbilityTypes, CardTypes } = require('../Constants');

const checkRestrictions = {
    abilitiesTriggeredByOpponents: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility() && context.ability.abilityType !== AbilityTypes.ForcedReaction && context.ability.abilityType !== AbilityTypes.ForcedInterrupt,
    adjacentCharacters: (context, effect) =>
        context.source.type === CardTypes.Character && context.player.areLocationsAdjacent(context.source.location, effect.context.source.location),
    attachmentsWithSameClan: (context, effect, card) =>
        context.source.type === CardTypes.Attachment &&
        context.source.getPrintedFaction() !== 'neutral' && card.isFaction(context.source.getPrintedFaction()),
    attackedProvince: (context) =>
        context.game.currentConflict && context.game.currentConflict.conflictProvince === context.source,
    attackedProvinceNonForced: (context) =>
        context.game.currentConflict && context.game.currentConflict.conflictProvince === context.source && context.ability.isTriggeredAbility() && context.ability.abilityType !== AbilityTypes.ForcedReaction && context.ability.abilityType !== AbilityTypes.ForcedInterrupt,
    cardEffects: (context) =>
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [CardTypes.Event, CardTypes.Character, CardTypes.Holding, CardTypes.Attachment, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role].includes(context.source.type),
    ringEffects: (context) => context.source.type === 'ring',
    cardAndRingEffects: (context) => checkRestrictions.cardEffects(context) || checkRestrictions.ringEffects(context),
    characters: context => context.source.type === CardTypes.Character,
    charactersWithNoFate: context => context.source.type === CardTypes.Character && context.source.getFate() === 0,
    copiesOfDiscardEvents: context =>
        context.source.type === CardTypes.Event && context.player.conflictDiscardPile.any(card => card.name === context.source.name),
    copiesOfX: (context, effect) => context.source.name === effect.params,
    events: context => context.source.type === CardTypes.Event,
    eventsWithSameClan: (context, effect, card) =>
        context.source.type === CardTypes.Event &&
        context.source.getPrintedFaction() !== 'neutral' && card.isFaction(context.source.getPrintedFaction()),
    nonSpellEvents: context => context.source.type === CardTypes.Event && !context.source.hasTrait('spell'),
    opponentsCardEffects: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [CardTypes.Event, CardTypes.Character, CardTypes.Holding, CardTypes.Attachment, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role].includes(context.source.type),
    opponentsEvents: (context, effect) =>
        context.player && context.player === getApplyingPlayer(effect).opponent && context.source.type === CardTypes.Event,
    opponentsRingEffects: (context, effect) =>
        context.player && context.player === getApplyingPlayer(effect).opponent && context.source.type === 'ring',
    opponentsCardAndRingEffects: (context, effect) => checkRestrictions.opponentsCardEffects(context, effect) || checkRestrictions.opponentsRingEffects(context, effect),
    opponentsTriggeredAbilities: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility(),
    opponentsCardAbilities: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isCardAbility(),
    provinces: context => context.source.type === CardTypes.Province,
    reactions: context => context.ability.abilityType === AbilityTypes.Reaction,
    source: (context, effect) => context.source === effect.context.source,
    keywordAbilities: context => context.ability.isKeywordAbility(),
    nonKeywordAbilities: context => !context.ability.isKeywordAbility(),
    nonForcedAbilities: context => context.ability.isTriggeredAbility() && context.ability.abilityType !== AbilityTypes.ForcedReaction && context.ability.abilityType !== AbilityTypes.ForcedInterrupt,
    equalOrMoreExpensiveCharacterTriggeredAbilities: (context, effect, card) => context.source.type === CardTypes.Character && !context.ability.isKeywordAbility && context.source.printedCost >= card.printedCost,
    equalOrMoreExpensiveCharacterKeywords: (context, effect, card) => context.source.type === CardTypes.Character && context.ability.isKeywordAbility && context.source.printedCost >= card.printedCost,
    eventPlayedByHigherBidPlayer: (context, effect, card) => context.source.type === CardTypes.Event && context.player.showBid > card.controller.showBid
};

const getApplyingPlayer = (effect) => {
    return effect.applyingPlayer || effect.context.player;
};

const leavePlayTypes = [
    'discardFromPlay',
    'sacrifice',
    'returnToHand',
    'returnToDeck',
    'removeFromGame'
];

class Restriction extends EffectValue {
    constructor(properties) {
        super();
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.type;
            this.restriction = properties.restricts;
            this.applyingPlayer = properties.applyingPlayer;
            this.params = properties.params;
        }
    }

    // @ts-ignore
    getValue() {
        return this;
    }

    isMatch(type, context, card) {
        if(this.type === 'leavePlay') {
            return leavePlayTypes.includes(type) && this.checkCondition(context, card);
        }
        return (!this.type || this.type === type) && this.checkCondition(context, card);
    }

    checkCondition(context, card) {
        if(Array.isArray(this.restriction)) {
            const vals = this.restriction.map(a => this.checkRestriction(a, context, card));
            return (vals.every(a => a));
        }

        return this.checkRestriction(this.restriction, context, card);
    }

    checkRestriction(restriction, context, card) {
        if(!restriction) {
            return true;
        } else if(!context) {
            throw new Error('checkCondition called without a context');
        } else if((typeof restriction === 'function')) {
            return restriction(context, this, card);
        } else if(!checkRestrictions[restriction]) {
            return context.source.hasTrait(restriction);
        }
        return checkRestrictions[restriction](context, this, card);
    }
}

module.exports = Restriction;
