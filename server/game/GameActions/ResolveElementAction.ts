import type AbilityContext from '../AbilityContext';
import { EffectNames, EventNames } from '../Constants';
import Event from '../Events/Event';
import type Player from '../player';
import type Ring from '../ring';
import { RingEffects } from '../RingEffects';
import { RingAction, type RingActionProperties } from './RingAction';

export interface ResolveElementProperties extends RingActionProperties {
    physicalRing?: Ring;
    player?: Player;
}

export class ResolveElementAction extends RingAction {
    name = 'resolveElement';
    eventName = EventNames.OnResolveRingElement;
    effect = 'resolve {0} effect';
    constructor(properties: ((context: AbilityContext) => ResolveElementProperties) | ResolveElementProperties) {
        super(properties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties: any = {}): void {
        let properties = this.getProperties(context, additionalProperties) as ResolveElementProperties;
        let target = properties.target as Ring[];
        let rings = target.map((element) => (typeof element === 'string' ? context.game.rings[element] : element));
        rings = rings.filter((a) => a != undefined);
        if (rings.length > 1) {
            let sortedRings = rings.sort((a, b) => {
                let aPriority = RingEffects.contextFor(context.player, a.element).ability.defaultPriority;
                let bPriority = RingEffects.contextFor(context.player, b.element).ability.defaultPriority;
                return context.player.firstPlayer ? aPriority - bPriority : bPriority - aPriority;
            });
            additionalProperties.optional = false;
            let effectObjects = sortedRings.map((ring) => ({
                title: RingEffects.getRingName(ring.element) + ' Effect',
                handler: () => context.game.openEventWindow(this.getEvent(ring, context, additionalProperties))
            }));
            events.push(
                new Event(EventNames.Unnamed, {}, () => context.game.openSimultaneousEffectWindow(effectObjects))
            );
        } else if (rings.length > 0) {
            events.push(this.getEvent(rings[0], context, additionalProperties));
        }
    }

    addPropertiesToEvent(event: any, ring: Ring, context: AbilityContext, additionalProperties: any): void {
        let { physicalRing, optional, player } = this.getProperties(
            context,
            additionalProperties
        ) as ResolveElementProperties;
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.player = player || context.player;
        event.physicalRing = physicalRing;
        event.optional = optional;
        event.effectivellyResolvedEffect = false;
    }

    eventHandler(event: any): void {
        const cannotResolveRingEffects = event.context.player.getEffects(EffectNames.CannotResolveRings);

        if (cannotResolveRingEffects.length) {
            event.context.game.addMessage("{0}'s ring effect is cancelled.", event.context.player);
            event.cancel();
            return;
        }

        event.context.game.resolveAbility(
            RingEffects.contextFor(event.player, event.ring.element, event.optional, (resolved) => {
                event.effectivellyResolvedEffect = resolved;
            })
        );
    }
}