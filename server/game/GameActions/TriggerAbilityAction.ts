import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type CardAbility from '../CardAbility.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import AbilityResolver from '../gamesteps/AbilityResolver.js';
import type Player from '../Player.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export interface TriggerAbilityProperties extends CardActionProperties {
    ability: CardAbility;
    subResolution?: boolean;
    ignoredRequirements?: string[];
    player?: Player;
    event?: Event;
}

export class TriggerAbilityAction extends CardGameAction<TriggerAbilityProperties> {
    name = 'triggerAbility';
    defaultProperties: TriggerAbilityProperties = {
        ability: null as unknown as CardAbility,
        ignoredRequirements: [],
        subResolution: false
    };

    getEffectMessage(context: TriggeredAbilityContext): MessageArgs {
        let properties = this.getProperties(context);
        return ['resolve {0}\'s {1} ability', [properties.target, properties.ability.title]];
    }

    canAffect(card: DrawCard, context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let ability = properties.ability as TriggeredAbility;
        let player = properties.player || context.player;
        let newContextEvent = properties.event;
        if(
            !super.canAffect(card, context) ||
            !ability ||
            (!properties.subResolution && player.isAbilityAtMax(ability.maxIdentifier))
        ) {
            return false;
        }
        let newContext = ability.createContext(player, newContextEvent);
        let ignoredRequirements = (properties.ignoredRequirements ?? []).concat('player', 'location', 'limit');
        return !ability.meetsRequirements(newContext, ignoredRequirements);
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties);
        let player = properties.player || (event.context as AbilityContext).player;
        let newContextEvent = properties.event;
        let newContext = (properties.ability as TriggeredAbility).createContext(player, newContextEvent);
        newContext.subResolution = !!properties.subResolution;
        if(properties.subResolution) {
            newContext.originatingContext = (event.context as AbilityContext).triggeringContext;
        }
        (event.context as AbilityContext).game.queueStep(new AbilityResolver((event.context as AbilityContext).game, newContext));
    }

    hasTargetsChosenByInitiatingPlayer(context: TriggeredAbilityContext) {
        let properties = this.getProperties(context);
        return (
            properties.ability &&
            properties.ability.hasTargetsChosenByInitiatingPlayer &&
            properties.ability.hasTargetsChosenByInitiatingPlayer(context)
        );
    }
}
