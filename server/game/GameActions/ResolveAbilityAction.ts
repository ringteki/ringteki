import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type CardAbility from '../CardAbility.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import InitiateCardAbilityEvent from '../Events/InitiateCardAbilityEvent.js';
import type Game from '../Game.js';
import AbilityResolver from '../gamesteps/AbilityResolver.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type Player from '../Player.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

class ResolveAbilityActionResolver extends AbilityResolver {
    ignoreCosts: boolean;

    constructor(game: Game, context: TriggeredAbilityContext, ignoreCosts: boolean) {
        super(game, context);
        this.ignoreCosts = ignoreCosts;
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow()),
            new SimpleStep(this.game, () => this.refillProvinces())
        ]);
    }

    getCostResults() {
        const results = super.getCostResults();
        results.canCancel = false;
        results.playCosts = false;
        results.triggerCosts = false;
        return results;
    }

    openInitiateAbilityEventWindow() {
        const params = { card: this.context.source, ability: this.context.ability, context: this.context };
        const events = [
            this.game.getEvent(EventName.OnCardAbilityInitiated, params, () => this.queueInitiateAbilitySteps())
        ];
        if(this.context.ability.isTriggeredAbility() && !this.context.subResolution) {
            events.push(
                this.game.getEvent(EventName.OnCardAbilityTriggered, {
                    player: this.context.player,
                    card: this.context.source,
                    context: this.context
                })
            );
        }
        this.game.openEventWindow(events);
    }

    initiateAbilityEffects() {
        if(this.cancelled) {
            for(const event of this.events) {
                event.cancel();
            }
            return;
        }
        const cardAbility = this.context.ability as CardAbility;
        if(cardAbility.max && !this.context.subResolution) {
            this.context.player.incrementAbilityMax(cardAbility.maxIdentifier);
        }
        cardAbility.displayMessage(this.context, 'resolves');
        this.game.openEventWindow(
            new InitiateCardAbilityEvent(
                { card: this.context.source, context: this.context },
                () => (this.initiateAbility = true)
            )
        );
    }

    resolveCosts() {
        if(!this.ignoreCosts) {
            super.resolveCosts();
        }
    }

    payCosts() {
        if(!this.ignoreCosts) {
            super.payCosts();
        }
    }
}

export interface ResolveAbilityProperties extends CardActionProperties {
    ability: CardAbility;
    subResolution?: boolean;
    ignoredRequirements?: string[];
    player?: Player;
    event?: Event;
    choosingPlayerOverride?: Player;
}

type ResolvedResolveAbilityProperties = ResolveAbilityProperties & {
    ignoredRequirements: NonNullable<ResolveAbilityProperties['ignoredRequirements']>;
};

export class ResolveAbilityAction extends CardGameAction {
    name = 'resolveAbility';
    defaultProperties: ResolveAbilityProperties = {
        ability: null as unknown as CardAbility,
        ignoredRequirements: [],
        subResolution: false,
        choosingPlayerOverride: undefined
    };
    constructor(
        properties: ((context: TriggeredAbilityContext) => ResolveAbilityProperties) | ResolveAbilityProperties
    ) {
        super(properties as CardActionProperties | ((context: AbilityContext) => CardActionProperties));
    }

    getEffectMessage(context: TriggeredAbilityContext): MessageArgs {
        let properties = this.getProperties(context) as ResolveAbilityProperties;
        return ['resolve {0}\'s {1} ability', [properties.target, properties.ability.title]];
    }

    canAffect(card: DrawCard, context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ResolvedResolveAbilityProperties;
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
        let ignoredRequirements = properties.ignoredRequirements.concat(
            'player',
            'location',
            'limit',
            'triggeringRestrictions'
        );
        return !ability.meetsRequirements(newContext, ignoredRequirements);
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown>): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties) as ResolvedResolveAbilityProperties;
        let player = properties.player || (event.context as AbilityContext).player;
        let newContextEvent = properties.event;
        let newContext = (properties.ability as TriggeredAbility).createContext(player, newContextEvent);
        newContext.subResolution = !!properties.subResolution;
        if(properties.subResolution) {
            newContext.originatingContext = (event.context as AbilityContext).triggeringContext;
        }
        if(properties.choosingPlayerOverride) {
            newContext.choosingPlayerOverride = properties.choosingPlayerOverride;
        }
        (event.context as AbilityContext).game.queueStep(
            new ResolveAbilityActionResolver(
                (event.context as AbilityContext).game,
                newContext,
                properties.ignoredRequirements.includes('cost')
            )
        );
    }

    hasTargetsChosenByInitiatingPlayer(context: TriggeredAbilityContext): boolean {
        let properties = this.getProperties(context) as ResolveAbilityProperties;
        return properties.ability.hasTargetsChosenByInitiatingPlayer(context);
    }
}
