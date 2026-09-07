import type { AbilityContext } from '../AbilityContext.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { EventName } from '../Constants.js';
import type { Cost } from './Cost.js';
import { Event } from '../Events/Event.js';
import { ReduceableFateCost } from './ReduceableFateCost.js';
import type DrawCard from '../DrawCard.js';

export class TargetDependentFateCost extends ReduceableFateCost implements Cost {
    constructor(ignoreType: boolean, public dependsOn: string) {
        super(ignoreType);
    }

    public canPay(context: AbilityContext<DrawCard>): boolean {
        if(context.source.printedCost === null) {
            return false;
        }
        if(!context.targets[this.dependsOn]) {
            // we don't need to check now because this will be checked again once targeting is done
            return true;
        }
        const reducedCost = context.player.getMinimumCost(
            context.playType,
            context,
            context.targets[this.dependsOn] as DrawCard,
            this.ignoreType
        );

        if(reducedCost !== 0 && this.payFateCostToOpponent && (!context.player.opponent || !context.player.opponent.checkRestrictions('gainFate', context))) {
            return false;
        }

        return (
            context.player.fate >= reducedCost &&
            (reducedCost === 0 || context.player.checkRestrictions('spendFate', context))
        );
    }

    public payEvent(context: TriggeredAbilityContext<DrawCard>): Event {
        const amount = (context.costs.targetDependentFate = this.getReducedCost(context));

        if(this.payFateCostToOpponent) {
            return new Event(EventName.OnMoveFate, { amount, context }, () => {
                context.player.markUsedReducers(
                    context.playType,
                    context.source,
                    context.targets[this.dependsOn] as DrawCard
                );
                context.player.fate -= this.getFinalFatecost(context, amount);
                if(context.player.opponent) {
                    context.player.opponent.fate += this.getFinalFatecost(context, amount);
                }
            });
        }

        return new Event(EventName.OnSpendFate, { amount, context }, () => {
            context.player.markUsedReducers(
                context.playType,
                context.source,
                context.targets[this.dependsOn] as DrawCard
            );
            context.player.fate -= this.getFinalFatecost(context, amount);
        });
    }

    protected getReducedCost(context: AbilityContext<DrawCard>): number {
        return context.player.getReducedCost(
            context.playType,
            context.source,
            context.targets[this.dependsOn] as DrawCard,
            this.ignoreType
        );
    }
}
