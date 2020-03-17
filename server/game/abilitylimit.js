const { EventNames } = require('./Constants');

class FixedAbilityLimit {
    constructor(max) {
        this.max = max;
        this.ability = null;
        this.useCount = {};
    }

    isRepeatable() {
        return false;
    }

    getModifiedMax(player) {
        return this.ability ? this.ability.card.getModifiedLimitMax(player, this.ability, this.max) : this.max;
    }

    isAtMax(player) {
        return this.useCount[player.name] && this.useCount[player.name] >= this.getModifiedMax(player);
    }

    increment(player) {
        if(this.useCount[player.name]) {
            this.useCount[player.name] += 1;
        } else {
            this.useCount[player.name] = 1;
        }
    }

    reset() {
        this.useCount = {};
    }

    registerEvents() {
        // No event handling
    }

    unregisterEvents() {
        // No event handling
    }
}

class RepeatableAbilityLimit extends FixedAbilityLimit {
    constructor(max, eventName) {
        super(max);

        if(!Array.isArray(eventName)) {
            eventName = [eventName];
        }

        this.eventName = eventName;
        this.resetHandler = () => this.reset();
    }

    isRepeatable() {
        return true;
    }

    registerEvents(eventEmitter) {
        this.eventName.forEach(eventN => {
            eventEmitter.on(eventN, this.resetHandler);
        });
    }

    unregisterEvents(eventEmitter) {
        this.eventName.forEach(eventN => {
            eventEmitter.removeListener(eventN, this.resetHandler);
        });
    }
}

var AbilityLimit = {};

AbilityLimit.fixed = function(max) {
    return new FixedAbilityLimit(max);
};

AbilityLimit.repeatable = function(max, eventName) {
    return new RepeatableAbilityLimit(max, eventName);
};

AbilityLimit.perConflict = function(max) {
    return new RepeatableAbilityLimit(max, EventNames.OnConflictFinished);
};

AbilityLimit.perConflictOpportunity = function(max) {
    return new RepeatableAbilityLimit(max, [EventNames.OnConflictFinished, EventNames.OnConflictPass]);
};

AbilityLimit.perPhase = function(max) {
    return new RepeatableAbilityLimit(max, EventNames.OnPhaseEnded);
};

AbilityLimit.perRound = function(max) {
    return new RepeatableAbilityLimit(max, EventNames.OnRoundEnded);
};

AbilityLimit.unlimitedPerConflict = function() {
    return new RepeatableAbilityLimit(Infinity, EventNames.OnConflictFinished);
};

module.exports = AbilityLimit;
