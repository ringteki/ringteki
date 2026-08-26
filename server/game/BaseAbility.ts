import AbilityTargetAbility from './AbilityTargets/AbilityTargetAbility.js';
import AbilityTargetCard from './AbilityTargets/AbilityTargetCard.js';
import AbilityTargetRing from './AbilityTargets/AbilityTargetRing.js';
import AbilityTargetSelect from './AbilityTargets/AbilityTargetSelect.js';
import AbilityTargetToken from './AbilityTargets/AbilityTargetToken.js';
import AbilityTargetElementSymbol from './AbilityTargets/AbilityTargetElementSymbol.js';
import { Stage, TargetMode, AbilityType, Players } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type { Cost } from './costs/Cost.js';
import type { TargetPropertiesInput } from './Interfaces.js';

interface AbilityTargetProperties {
    dependsOn?: string;
    player?: ((context: AbilityContext) => Players) | Players;
}

interface AbilityTarget {
    name: string;
    properties: AbilityTargetProperties;
    dependentCost?: Cost | null;
    canResolve(context: AbilityContext): boolean;
    resolve(context: AbilityContext, targetResults: TargetResults): void;
    checkTarget(context: AbilityContext): boolean;
    hasLegalTarget(context: AbilityContext): boolean;
    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean;
    getGameAction(context: AbilityContext): GameAction[];
}

export interface BaseAbilityProperties {
    cost?: Cost | Cost[];
    target?: TargetPropertiesInput;
    targets?: Record<string, TargetPropertiesInput>;
    gameAction?: GameAction | GameAction[];
}

interface TargetResults {
    canIgnoreAllCosts?: boolean;
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityTarget | null;
    playCosts?: boolean;
    triggerCosts?: boolean;
    events?: Event[];
}

/**
 * Base class representing an ability that can be done by the player. This
 * includes card actions, reactions, interrupts, playing a card, marshaling a
 * card.
 *
 * Most of the methods take a context object. While the structure will vary from
 * inheriting classes, it is guaranteed to have at least the `game` object, the
 * `player` that is executing the action, and the `source` card object that the
 * ability is generated from.
 */
class BaseAbility {
    abilityType: AbilityType = AbilityType.Action;
    gameAction: GameAction[];
    targets: AbilityTarget[];
    cost: Cost[];
    nonDependentTargets: AbilityTarget[];

    /**
     * Creates an ability.
     *
     * @param properties - An object with ability related properties.
     * @param properties.cost - optional property that specifies the cost for the ability.
     * @param properties.target - optional property that specifies the target of the ability.
     * @param properties.gameAction - optional array of game actions
     */
    constructor(properties: BaseAbilityProperties) {
        this.gameAction = properties.gameAction ? (Array.isArray(properties.gameAction) ? properties.gameAction : [properties.gameAction]) : [];
        this.targets = [];
        this.buildTargets(properties);
        this.cost = this.buildCost(properties.cost);
        for(const cost of this.cost) {
            if(cost.dependsOn) {
                const dependsOnTarget = this.targets.find((target) => target.name === cost.dependsOn);
                if(dependsOnTarget) {
                    dependsOnTarget.dependentCost = cost;
                }
            }
        }
        this.nonDependentTargets = this.targets.filter((target) => !target.properties.dependsOn);
    }

    buildCost(cost?: Cost | Cost[]): Cost[] {
        if(!cost) {
            return [];
        }

        if(!Array.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties: BaseAbilityProperties): void {
        this.targets = [];
        if(properties.target) {
            this.targets.push(this.getAbilityTarget('target', properties.target));
        } else if(properties.targets) {
            for(const key of Object.keys(properties.targets)) {
                this.targets.push(this.getAbilityTarget(key, properties.targets[key]));
            }
        }
    }

    getAbilityTarget(name: string, properties: TargetPropertiesInput): AbilityTarget {
        const gameAction = properties.gameAction
            ? (Array.isArray(properties.gameAction) ? properties.gameAction : [properties.gameAction])
            : [];
        const normalized = { ...properties, gameAction };
        if(normalized.mode === TargetMode.Select) {
            return new AbilityTargetSelect(name, normalized, this);
        } else if(normalized.mode === TargetMode.Ring) {
            return new AbilityTargetRing(name, normalized, this);
        } else if(normalized.mode === TargetMode.Ability) {
            return new AbilityTargetAbility(name, normalized, this);
        } else if(normalized.mode === TargetMode.Token) {
            return new AbilityTargetToken(name, normalized, this);
        } else if(normalized.mode === TargetMode.ElementSymbol) {
            return new AbilityTargetElementSymbol(name, normalized, this);
        }
        return new AbilityTargetCard(name, normalized, this);
    }

    meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []): string {
        // check legal targets exist
        // check costs can be paid
        // check for potential to change game state
        if(!this.canPayCosts(context) && !ignoredRequirements.includes('cost')) {
            return 'cost';
        }
        if(this.targets.length === 0) {
            if(this.gameAction.length > 0 && !this.checkGameActionsForPotential(context)) {
                return 'condition';
            }
            return '';
        }
        return this.canResolveTargets(context) ? '' : 'target';
    }

    checkGameActionsForPotential(context: AbilityContext): boolean {
        return this.gameAction.some((gameAction) => gameAction.hasLegalTarget(context));
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     */
    canPayCosts(context: AbilityContext): boolean {
        const contextCopy = context.copy({ stage: Stage.Cost });
        return this.getCosts(context).every((cost) => cost.canPay(contextCopy));
    }

    getCosts(context: AbilityContext, playCosts = true, _triggerCosts = true): Cost[] {
        let costs = this.cost.map((a) => a);
        if(context.ignoreFateCost) {
            costs = costs.filter((cost) => !cost.isPrintedFateCost);
        }

        if(!playCosts) {
            costs = costs.filter((cost) => !cost.isPlayCost);
        }

        if (context.payFateCostToOpponent) {
            costs.forEach(cost => cost.payFateCostToOpponent = true)
        }
        return costs;
    }

    resolveCosts(context: AbilityContext, results: TargetResults): void {
        for(const cost of this.getCosts(context, results.playCosts, results.triggerCosts)) {
            context.game.queueSimpleStep(() => {
                if(!results.cancelled) {
                    if(cost.addEventsToArray) {
                        cost.addEventsToArray(results.events ?? [], context, results);
                    } else {
                        if(cost.resolve) {
                            cost.resolve(context, results);
                        }
                        context.game.queueSimpleStep(() => {
                            if(!results.cancelled) {
                                const newEvents = cost.payEvent
                                    ? cost.payEvent(context as TriggeredAbilityContext)
                                    : context.game.getEvent('payCost', {}, () => cost.pay?.(context as TriggeredAbilityContext));
                                if(Array.isArray(newEvents)) {
                                    for(const event of newEvents) {
                                        results.events?.push(event);
                                    }
                                } else {
                                    results.events?.push(newEvents);
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     */
    canResolveTargets(context: AbilityContext): boolean {
        return this.nonDependentTargets.every((target) => target.canResolve(context));
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     */
    resolveTargets(context: AbilityContext): TargetResults {
        const targetResults: TargetResults = {
            canIgnoreAllCosts:
                context.stage === Stage.PreTarget ? this.cost.every((cost) => cost.canIgnoreForTargeting) : false,
            cancelled: false,
            payCostsFirst: false,
            delayTargeting: null
        };
        for(const target of this.targets) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    resolveRemainingTargets(context: AbilityContext, nextTarget: AbilityTarget): TargetResults {
        const index = this.targets.indexOf(nextTarget);
        let targets = this.targets.slice();
        if(targets.slice(0, index).every((target) => target.checkTarget(context))) {
            targets = targets.slice(index);
        }
        const targetResults: TargetResults = {};
        for(const target of targets) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    hasLegalTargets(context: AbilityContext): boolean {
        return this.nonDependentTargets.every((target) => target.hasLegalTarget(context));
    }

    checkAllTargets(context: AbilityContext): boolean {
        return this.nonDependentTargets.every((target) => target.checkTarget(context));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return (
            this.targets.some((target) => target.hasTargetsChosenByInitiatingPlayer(context)) ||
            this.gameAction.some((action) => action.hasTargetsChosenByInitiatingPlayer(context)) ||
            this.cost.some(
                (cost) => cost.hasTargetsChosenByInitiatingPlayer && cost.hasTargetsChosenByInitiatingPlayer(context)
            )
        );
    }

    displayMessage(_context: AbilityContext): void {}

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(_context: AbilityContext): void {}

    isAction(): boolean {
        return false;
    }

    isCardPlayed(): boolean {
        return false;
    }

    isCardAbility(): boolean {
        return false;
    }

    isTriggeredAbility(): boolean {
        return false;
    }

    isKeywordAbility(): boolean {
        return false;
    }
}

export default BaseAbility;
