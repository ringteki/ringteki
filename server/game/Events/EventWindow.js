const _ = require('underscore');

const { BaseStepWithPipeline } = require('../gamesteps/BaseStepWithPipeline.js');
const ForcedTriggeredAbilityWindow = require('../gamesteps/forcedtriggeredabilitywindow.js');
const { SimpleStep } = require('../gamesteps/SimpleStep.js');
const TriggeredAbilityWindow = require('../gamesteps/triggeredabilitywindow.js');
const { AbilityTypes } = require('../Constants');
const KeywordAbilityWindow = require('../gamesteps/keywordabilitywindow.js');

class EventWindow extends BaseStepWithPipeline {
    constructor(game, events) {
        super(game);

        this.events = [];
        this.thenAbilities = [];
        this.provincesToRefill = [];
        _.each(events, event => {
            if(!event.cancelled) {
                this.addEvent(event);
            }
        });

        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.setCurrentEventWindow()),
            new SimpleStep(this.game, () => this.checkEventCondition()),
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.WouldInterrupt)),
            new SimpleStep(this.game, () => this.createContingentEvents()),
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.ForcedInterrupt)),
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.Interrupt)),
            new SimpleStep(this.game, () => this.checkKeywordAbilities(AbilityTypes.KeywordInterrupt)),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.checkKeywordAbilities(AbilityTypes.KeywordReaction)),
            new SimpleStep(this.game, () => this.checkThenAbilities()),
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.ForcedReaction)),
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.DuelReaction)), // ONLY USE FOR DUEL CHALLENGE, FOCUS, AND STRIKE
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.Reaction)),
            new SimpleStep(this.game, () => this.resetCurrentEventWindow())
        ]);
    }

    addEvent(event) {
        event.setWindow(this);
        this.events.push(event);
        return event;
    }

    removeEvent(event) {
        this.events = _.reject(this.events, e => e === event);
        return event;
    }

    addThenAbility(ability, context, condition = event => event.isFullyResolved(event)) {
        this.thenAbilities.push({ ability, context, condition });
    }

    setCurrentEventWindow() {
        this.previousEventWindow = this.game.currentEventWindow;
        this.game.currentEventWindow = this;
    }

    checkEventCondition() {
        _.each(this.events, event => event.checkCondition());
    }

    openWindow(abilityType) {
        if(_.isEmpty(this.events)) {
            return;
        }

        if([AbilityTypes.ForcedReaction, AbilityTypes.ForcedInterrupt].includes(abilityType)) {
            this.queueStep(new ForcedTriggeredAbilityWindow(this.game, abilityType, this));
        } else {
            this.queueStep(new TriggeredAbilityWindow(this.game, abilityType, this));
        }
    }

    // This is primarily for LeavesPlayEvents
    createContingentEvents() {
        let contingentEvents = [];
        _.each(this.events, event => {
            contingentEvents = contingentEvents.concat(event.createContingentEvents());
        });
        if(contingentEvents.length > 0) {
            // Exclude current events from the new window, we just want to give players opportunities to respond to the contingent events
            this.queueStep(new TriggeredAbilityWindow(this.game, AbilityTypes.WouldInterrupt, this, this.events.slice(0)));
            _.each(contingentEvents, event => this.addEvent(event));
        }
    }

    // This catches any persistent/delayed effect cancels
    checkForOtherEffects() {
        _.each(this.events, event => this.game.emit(event.name + ':' + AbilityTypes.OtherEffects, event));
    }

    preResolutionEffects() {
        _.each(this.events, event => event.preResolutionEffect());
    }

    executeHandler() {
        this.eventsToExecute = _.sortBy(this.events, 'order');

        _.each(this.eventsToExecute, event => {
            // need to checkCondition here to ensure the event won't fizzle due to another event's resolution (e.g. double honoring an ordinary character with YR etc.)
            event.checkCondition();
            if(!event.cancelled) {
                event.executeHandler();
                this.game.emit(event.name, event);
            }
        });
    }

    checkGameState() {
        this.eventsToExecute = this.eventsToExecute.filter(event => !event.cancelled);
        this.game.checkGameState(_.any(this.eventsToExecute, event => event.handler), this.eventsToExecute);
    }

    checkKeywordAbilities(abilityType) {
        if(_.isEmpty(this.events)) {
            return;
        }

        this.queueStep(new KeywordAbilityWindow(this.game, abilityType, this));
    }

    checkThenAbilities() {
        for(const thenAbility of this.thenAbilities) {
            if(thenAbility.context.events.every(event => thenAbility.condition(event))) {
                this.game.resolveAbility(thenAbility.ability.createContext(thenAbility.context.player));
            }
        }
    }

    resetCurrentEventWindow() {
        if(this.previousEventWindow) {
            this.previousEventWindow.checkEventCondition();
            this.game.currentEventWindow = this.previousEventWindow;
        } else {
            this.game.currentEventWindow = null;
        }
    }
}

module.exports = EventWindow;
