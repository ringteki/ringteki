import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames} from '../Constants';
import { player } from '../Effects/EffectBuilder';

export interface RemoveRingFromPlayProperties extends RingActionProperties {
}

export class RemoveRingFromPlayAction extends RingAction {
    name = 'removeRingFromPlay';
    eventName = EventNames.OnRemoveRingFromPlay;
    effect = 'remove the {0} from play';
    constructor(properties: ((context: AbilityContext) => RemoveRingFromPlayProperties) | RemoveRingFromPlayProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        if(ring.removedFromGame) {
            return false;
        }

        return super.canAffect(ring, context);
    }

    eventHandler(event, additionalProperties): void {
        let ring = event.ring;
        let context = event.context;

        context.game.raiseEvent(EventNames.OnRemoveRingFromPlay, { ring:ring }, () => ring.removeRingFromPlay());
    }
}

