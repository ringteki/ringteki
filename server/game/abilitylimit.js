const { EventNames } = require('./Constants');

class FixedAbilityLimit {
    constructor(max) {
        this.max = max;
        this.ability = null;
        this.useCount = {};
        this.currentUser = null;
    }

    isRepeatable() {
        return false;
    }

    getModifiedMax(player) {
        return this.ability ? this.ability.card.getModifiedLimitMax(player, this.ability, this.max) : this.max;
    }

    isAtMax(player) {
        const key = this.getKey(player.name);
        return this.useCount[key] && this.useCount[key] >= this.getModifiedMax(player);
    }

    increment(player) {
        const key = this.getKey(player.name);
        if(this.useCount[key]) {
            this.useCount[key] += 1;
        } else {
            this.useCount[key] = 1;
        }
    }

    getKey(player) {
        if(this.currentUser) {
            return player + this.currentUser;
        }
        return player;
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
