import { Event } from './Event.js';
import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';

class InitiateCardAbilityEvent extends Event {
    cardTargets: unknown[];
    ringTargets: unknown[];
    selectTargets: unknown[];
    tokenTargets: unknown[];
    allTargets: unknown[];

    constructor(params: Record<string, unknown>, handler?: (event: Event) => void) {
        super(EventName.OnInitiateAbilityEffects, params, handler);
        const ctx = this.context;
        if(ctx && !(ctx.ability as { doesNotTarget?: boolean })?.doesNotTarget) {
            this.cardTargets = Object.values(ctx.targets).flat();
            this.ringTargets = Object.values(ctx.rings).flat();
            this.selectTargets = Object.values(ctx.selects).flat();
            this.tokenTargets = Object.values(ctx.tokens).flat();
        } else {
            this.cardTargets = [];
            this.ringTargets = [];
            this.selectTargets = [];
            this.tokenTargets = [];
        }
        this.allTargets = this.cardTargets.concat(this.ringTargets, this.selectTargets, this.tokenTargets);
        // Record chosen cards on the triggering context, so continuations (sub-resolutions)
        // stay visible to cards reacting to the original triggering.
        const triggeringContext = ctx?.triggeringContext;
        if(triggeringContext) {
            for(const card of this.cardTargets as BaseCard[]) {
                if(!triggeringContext.chosenCardTargets.includes(card)) {
                    triggeringContext.chosenCardTargets.push(card);
                }
            }
        }
    }
}

export default InitiateCardAbilityEvent;
