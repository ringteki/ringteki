const { GameModes } = require('../GameModes.js');
const CardAbility = require('./CardAbility.js');
const { AbilityTypes, CardTypes, Phases, PlayTypes, EffectNames } = require('./Constants');

/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
 * condition    - optional function that should return true when the action is
 *                allowed, false otherwise. It should generally be used to check
 *                if the action can modify game state (step #1 in ability
 *                resolution in the rules).
 * cost         - object or array of objects representing the cost required to
 *                be paid before the action will activate. See Costs.
 * phase        - string representing which phases the action may be executed.
 *                Defaults to 'any' which allows the action to be executed in
 *                any phase.
 * location     - string indicating the location the card should be in in order
 *                to activate the action. Defaults to 'play area'.
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * max          - optional AbilityLimit object that represents the max number of
 *                times the ability by card title can be used. Contrast with
 *                `limit` which limits per individual card.
 * anyPlayer    - boolean indicating that the action may be executed by a player
 *                other than the card's controller. Defaults to false.
 * clickToActivate - boolean that indicates the action should be activated when
 *                   the card is clicked.
 */
class CardAction extends CardAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.abilityType = AbilityTypes.Action;
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;
        this.condition = properties.condition;
        this.doesNotTarget = properties.doesNotTarget;
        this.conflictProvinceCondition = properties.conflictProvinceCondition || (province => province === this.card);
        this.canTriggerOutsideConflict = !!properties.canTriggerOutsideConflict;
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('location') && !this.isInValidLocation(context)) {
            return 'location';
        }

        if(!ignoredRequirements.includes('province') && !this.checkProvinceCondition()) {
            return 'province';
        }

        if(!ignoredRequirements.includes('phase') && this.phase !== 'any' && this.phase !== this.game.currentPhase) {
            return 'phase';
        }

        if(!ignoredRequirements.includes('phase') && this.game.gameMode === GameModes.Skirmish && this.game.currentPhase === Phases.Dynasty && this.card.type === CardTypes.Event && context.playType === PlayTypes.PlayFromHand) {
            return 'phase';
        }

        let canOpponentTrigger = this.card.anyEffect(EffectNames.CanBeTriggeredByOpponent) && this.abilityType !== AbilityTypes.ForcedInterrupt && this.abilityType !== AbilityTypes.ForcedReaction;
        let canPlayerTrigger = this.anyPlayer || context.player === this.card.controller || canOpponentTrigger;
        if(!ignoredRequirements.includes('player') && this.card.type !== CardTypes.Event && !canPlayerTrigger) {
            return 'player';
        }

        if(!ignoredRequirements.includes('condition') && this.condition && !this.condition(context)) {
            return 'condition';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    checkProvinceCondition() {
        return this.card.type !== CardTypes.Province || this.canTriggerOutsideConflict ||
            this.game.currentConflict && this.game.currentConflict.getConflictProvinces().some(p => this.conflictProvinceCondition(p));
    }

    isAction() {
        return true;
    }
}

module.exports = CardAction;
