import { GameAction, GameActionProperties } from './GameAction';
import { Durations, Players, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import { WhenType } from '../Interfaces';
import BaseAbility = require('../baseability');
import Player = require('../player');

export interface LastingEffectGeneralProperties extends GameActionProperties {
    duration?: Durations;
    condition?: (context: AbilityContext) => boolean;
    until?: WhenType;
    effect?: any;
    ability?: BaseAbility;
}

export interface LastingEffectProperties extends LastingEffectGeneralProperties {
    targetController?: Players | Player;
}

export class LastingEffectAction extends GameAction {
    name = 'applyLastingEffect';
    eventName = EventNames.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: [],
        ability: null
    };

    getProperties(context: AbilityContext, additionalProperties = {}): LastingEffectProperties {
        let properties = super.getProperties(context, additionalProperties) as LastingEffectProperties;
        if(!Array.isArray(properties.effect)) {
            properties.effect = [properties.effect];
        }
        return properties;
    }
    
    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.effect.length > 0;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties): void {
        let properties = this.getProperties(context, additionalProperties);
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties);
        if (!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source[properties.duration](() => properties);
    }
}
