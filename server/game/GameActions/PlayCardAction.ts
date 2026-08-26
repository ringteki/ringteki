import type { AbilityContext } from '../AbilityContext.js';
import type BaseAction from '../BaseAction.js';
import type BaseCard from '../BaseCard.js';
import type BaseCardAbility from '../BaseCardAbility.js';
import { Location, PlayType, Stage } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import type Game from '../Game.js';
import AbilityResolver from '../gamesteps/AbilityResolver.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

class PlayCardResolver extends AbilityResolver {
    playGameAction: PlayCardAction;
    gameActionContext: AbilityContext;
    gameActionProperties: PlayCardProperties;
    cancelPressed: boolean;
    constructor(game: Game, context: AbilityContext, playGameAction: PlayCardAction, gameActionContext: AbilityContext, gameActionProperties: PlayCardProperties) {
        super(game, context);
        this.playGameAction = playGameAction;
        this.gameActionContext = gameActionContext;
        this.gameActionProperties = gameActionProperties;
        this.cancelPressed = false;
        context.ignoreFateCost = this.gameActionProperties.ignoreFateCost;
        context.onPlayCardSource = this.gameActionProperties.source;
        context.payFateCostToOpponent = this.gameActionProperties.payFateToOpponent;
    }

    resolveEarlyTargets() {
        if(this.gameActionProperties.playCardTarget) {
            this.context.stage = Stage.PreTarget;
            this.targetResults = {
                canIgnoreAllCosts: false,
                cancelled: false,
                payCostsFirst: false,
                delayTargeting: null
            };
            this.gameActionProperties.playCardTarget(this.context, this.gameActionProperties);
        } else {
            super.resolveEarlyTargets();
        }
    }

    checkForCancel() {
        super.checkForCancel();
        if(this.cancelled && this.gameActionProperties.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext, this.gameActionProperties);
            this.cancelPressed = true;
        }
    }

    resolveCosts() {
        if(this.gameActionProperties.payCosts) {
            super.resolveCosts();
        }
    }

    payCosts() {
        if(this.gameActionProperties.payCosts) {
            super.payCosts();
        }
        if(this.cancelled && this.gameActionProperties.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext, this.gameActionProperties);
            this.cancelPressed = true;
        }
    }

    moveEventCardToDiscard() {
        if(this.context.source.location === Location.BeingPlayed) {
            const location =
                (this.initiateAbility && this.gameActionProperties.destination) || Location.ConflictDiscardPile;
            if(location === Location.RemovedFromGame) {
                this.game.addMessage(
                    '{0} is removed from the game by {1}\'s effect',
                    this.context.source,
                    this.gameActionContext.source
                );
            }
            if(location === Location.ConflictDeck && this.gameActionProperties.destinationOptions?.bottom) {
                this.game.addMessage(
                    '{0} is placed on the bottom of {1}\'s deck by {2}\'s effect',
                    this.context.source,
                    this.context.player,
                    this.gameActionContext.source
                );
            }
            this.context.player.moveCard(this.context.source, location, this.gameActionProperties.destinationOptions);
        }
    }

    refillProvinces() {
        super.refillProvinces();
        if(!this.cancelPressed) {
            this.game.queueSimpleStep(() => this.gameActionProperties.postHandler?.(this.context));
        }
    }
}

export interface PlayCardProperties extends CardActionProperties {
    resetOnCancel?: boolean;
    postHandler?: (context: AbilityContext) => void;
    playType?: PlayType;
    playCardTarget?: (context: AbilityContext, properties: PlayCardProperties) => void;
    location?: Location;
    destination?: Location;
    destinationOptions?: { bottom?: boolean; [key: string]: unknown };
    payCosts?: boolean;
    ignoreFateCost?: boolean;
    source?: BaseCard;
    allowReactions?: boolean;
    ignoredRequirements?: string[];
    playAction?: BaseAction | BaseAction[];
    payFateToOpponent?: boolean;
}

export class PlayCardAction extends CardGameAction {
    name = 'playCard';
    effect = 'play {0} as if it were in their hand';
    defaultProperties: PlayCardProperties = {
        resetOnCancel: false,
        postHandler: () => true,
        destinationOptions: {},
        payCosts: true,
        ignoreFateCost: false,
        allowReactions: false,
        ignoredRequirements: [],
        playAction: undefined,
        source: undefined
    };
    constructor(properties: ((context: AbilityContext) => PlayCardProperties) | PlayCardProperties) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): PlayCardProperties {
        return super.getProperties(context, additionalProperties) as PlayCardProperties;
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        if(!super.canAffect(card, context)) {
            return false;
        }
        const properties = this.getProperties(context, additionalProperties);
        return this.getLegalAbilities(card, context, properties).length > 0;
    }

    getLegalAbilities(card: DrawCard, context: AbilityContext, properties: PlayCardProperties) {
        let legalActions = this.getLegalActions(card, context, properties);
        let legalReactions = this.getLegalReactions(card, context, properties);

        let legalAbilities = legalActions.concat(legalReactions);

        return legalAbilities.filter((ability: BaseCardAbility) => {
            const ignoredRequirements = ['location', 'player', ...(properties.ignoredRequirements ?? [])];
            if(!properties.payCosts) {
                ignoredRequirements.push('cost');
            }
            let newContext = ability.createContext(context.player);
            newContext.gameActionsResolutionChain = context.gameActionsResolutionChain.concat(this);
            newContext.ignoreFateCost = properties.ignoreFateCost;
            this.setPlayType(newContext, properties.playType ?? PlayType.Other, card.location);
            return !ability.meetsRequirements(newContext, ignoredRequirements);
        });
    }

    getLegalActions(card: DrawCard, context: AbilityContext, properties: PlayCardProperties) {
        if(properties.playAction) {
            let actions = properties.playAction;
            if(!Array.isArray(actions)) {
                actions = [actions];
            }
            return actions;
        }
        return card.getPlayActions();
    }

    getLegalReactions(card: DrawCard, context: AbilityContext, properties: PlayCardProperties) {
        if(!properties.allowReactions) {
            return [];
        }
        return card.getReactions();
    }

    setPlayType(context: AbilityContext, playType: PlayType, location: Location): void {
        context.playType =
            playType ||
            context.playType ||
            (location.includes('province') && PlayType.PlayFromProvince) ||
            (location === 'hand' && PlayType.PlayFromHand) ||
            PlayType.Other;
    }

    cancelAction(context: AbilityContext, properties: PlayCardProperties): number {
        if(properties.parentAction) {
            properties.parentAction.resolve(undefined, context);
        }
        return 0;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        const targets = properties.target as DrawCard | DrawCard[] | undefined;
        if(!targets || (Array.isArray(targets) && targets.length === 0)) {
            return;
        }
        let card: DrawCard = Array.isArray(targets) ? targets[0] : targets;
        let abilities = this.getLegalAbilities(card, context, properties);
        if(abilities.length === 1) {
            events.push(
                this.getPlayCardEvent(card, context, abilities[0].createContext(context.player), additionalProperties)
            );
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            source: card,
            choices: abilities.map((action: BaseCardAbility) => action.title).concat(properties.resetOnCancel ? 'Cancel' : []),
            handlers: abilities
                .map(
                    (action: BaseCardAbility) => () =>
                        events.push(
                            this.getPlayCardEvent(
                                card,
                                context,
                                action.createContext(context.player),
                                additionalProperties
                            )
                        )
                )
                .concat(() => this.cancelAction(context, properties))
        });
    }

    addPropertiesToEvent(event: Event, card: DrawCard, context: AbilityContext): void {
        event.onPlayCardSource = context.source;
    }

    getPlayCardEvent(
        card: DrawCard,
        context: AbilityContext,
        actionContext: AbilityContext,
        additionalProperties: Record<string, unknown> = {}
    ): Event {
        this.updateForDragonTattoo_DYH(context, actionContext);
        let properties = this.getProperties(context, additionalProperties);
        let event = this.createEvent(card, context, additionalProperties);
        this.updateEvent(event, card, context, additionalProperties);
        this.setPlayType(actionContext, properties.playType ?? PlayType.Other, card.location);
        event.replaceHandler(() =>
            context.game.queueStep(new PlayCardResolver(context.game, actionContext, this, context, properties))
        );
        return event;
    }

    updateForDragonTattoo_DYH(context: AbilityContext, actionContext: AbilityContext) {
        const innerCtx = (context as TriggeredAbilityContext).event?.context as TriggeredAbilityContext | undefined;
        if(innerCtx?.event) {
            (actionContext as TriggeredAbilityContext).event = innerCtx.event;
        }
    }

    checkEventCondition(): boolean {
        return true;
    }
}
