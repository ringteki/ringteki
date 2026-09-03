import type { AbilityContext } from '../AbilityContext.js';
import { BaseStepWithPipeline } from '../gamesteps/BaseStepWithPipeline.js';
import ForcedTriggeredAbilityWindow from '../gamesteps/ForcedTriggeredAbilityWindow.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import TriggeredAbilityWindow from '../gamesteps/TriggeredAbilityWindow.js';
import { AbilityType } from '../Constants.js';
import KeywordAbilityWindow from '../gamesteps/KeywordAbilityWindow.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import type { Event } from './Event.js';

interface ThenAbilityLike {
    createContext(player?: Player): AbilityContext;
}

export default class EventWindow extends BaseStepWithPipeline {
    events: Event[] = [];
    thenAbilities: Array<{ ability: ThenAbilityLike; context: AbilityContext; condition: (event: Event) => boolean }> = [];
    provincesToRefill: unknown[] = [];
    previousEventWindow: EventWindow | null = null;
    eventsToExecute: Event[] = [];

    constructor(game: Game, events: Event[]) {
        super(game);

        events.forEach(event => {
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
            new SimpleStep(this.game, () => this.openWindow(AbilityType.WouldInterrupt)),
            new SimpleStep(this.game, () => this.createContingentEvents()),
            new SimpleStep(this.game, () => this.openWindow(AbilityType.ForcedInterrupt)),
            new SimpleStep(this.game, () => this.openWindow(AbilityType.Interrupt)),
            new SimpleStep(this.game, () => this.checkKeywordAbilities(AbilityType.KeywordInterrupt)),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.checkKeywordAbilities(AbilityType.KeywordReaction)),
            new SimpleStep(this.game, () => this.checkThenAbilities()),
            new SimpleStep(this.game, () => this.openWindow(AbilityType.ForcedReaction)),
            new SimpleStep(this.game, () => this.openWindow(AbilityType.DuelReaction)), // ONLY USE FOR DUEL CHALLENGE, FOCUS, AND STRIKE
            new SimpleStep(this.game, () => this.openWindow(AbilityType.Reaction)),
            new SimpleStep(this.game, () => this.resetCurrentEventWindow())
        ]);
    }

    addEvent(event: Event): Event {
        event.setWindow(this);
        this.events.push(event);
        return event;
    }

    removeEvent(event: Event): Event {
        this.events = this.events.filter(e => e !== event);
        return event;
    }

    addThenAbility(ability: ThenAbilityLike, context: AbilityContext, condition: (event: Event) => boolean = event => event.isFullyResolved()) {
        this.thenAbilities.push({ ability, context, condition });
    }

    setCurrentEventWindow() {
        this.previousEventWindow = this.game.currentEventWindow;
        this.game.currentEventWindow = this;
    }

    checkEventCondition() {
        this.events.forEach(event => event.checkCondition());
    }

    openWindow(abilityType: AbilityType) {
        if(this.events.length === 0) {
            return;
        }

        if([AbilityType.ForcedReaction, AbilityType.ForcedInterrupt].includes(abilityType)) {
            this.queueStep(new ForcedTriggeredAbilityWindow(this.game, abilityType, this));
        } else {
            this.queueStep(new TriggeredAbilityWindow(this.game, abilityType, this));
        }
    }

    // This is primarily for LeavesPlayEvents
    createContingentEvents() {
        let contingentEvents: Event[] = [];
        this.events.forEach(event => {
            contingentEvents = contingentEvents.concat(event.createContingentEvents());
        });
        if(contingentEvents.length > 0) {
            // Exclude current events from the new window, we just want to give players opportunities to respond to the contingent events
            this.queueStep(new TriggeredAbilityWindow(this.game, AbilityType.WouldInterrupt, this, this.events.slice(0)));
            contingentEvents.forEach(event => this.addEvent(event));
        }
    }

    // This catches any persistent/delayed effect cancels
    checkForOtherEffects() {
        this.events.forEach(event => this.game.emit(event.name + ':' + AbilityType.OtherEffects, event));
    }

    preResolutionEffects() {
        this.events.forEach(event => event.preResolutionEffect());
    }

    executeHandler() {
        this.eventsToExecute = [...this.events].sort((a, b) => a.order - b.order);

        this.eventsToExecute.forEach(event => {
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
        this.game.checkGameState(this.eventsToExecute.some(event => event.hasHandler()), this.eventsToExecute);
    }

    checkKeywordAbilities(abilityType: AbilityType) {
        if(this.events.length === 0) {
            return;
        }

        this.queueStep(new KeywordAbilityWindow(this.game, abilityType, this));
    }

    checkThenAbilities() {
        for(const thenAbility of this.thenAbilities) {
            if(thenAbility.context.events.every((event) => thenAbility.condition(event))) {
                const thenContext = thenAbility.ability.createContext(thenAbility.context.player);
                // a `then` continues the same triggering, so keep the link for chosenCardTargets
                thenContext.originatingContext = thenAbility.context.triggeringContext;
                this.game.resolveAbility(thenContext);
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
