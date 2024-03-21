import { v1 as uuidV1 } from 'uuid';

import type { AbilityContext } from './AbilityContext';
import { EffectNames, Stages } from './Constants';
import type { CardEffect } from './Effects/types';
import type Game from './game';
import type { GameAction } from './GameActions/GameAction';
import * as GameActions from './GameActions/GameActions';
import type Player from './player';

export class GameObject {
    public uuid = uuidV1();
    protected effects = [] as CardEffect[];

    public constructor(
        public game: Game,
        public id: string
    ) {}

    public addEffect(effect: CardEffect) {
        this.effects.push(effect);
    }

    public removeEffect(effect: CardEffect) {
        this.effects = this.effects.filter((e) => e !== effect);
    }

    public getEffects<V = any>(type: EffectNames): V[] {
        let filteredEffects = this.getRawEffects().filter((effect) => effect.type === type);
        return filteredEffects.map((effect) => effect.getValue(this));
    }

    public sumEffects(type: EffectNames) {
        let filteredEffects = this.getEffects(type);
        return filteredEffects.reduce((total, effect) => total + effect, 0);
    }

    public anyEffect(type: EffectNames) {
        return this.getEffects(type).length > 0;
    }

    public allowGameAction(actionType: string, context = this.game.getFrameworkContext()) {
        const gameActionFactory = GameActions[actionType];
        if (gameActionFactory) {
            const gameAction: GameAction = gameActionFactory();
            return gameAction.canAffect(this, context);
        }
        return this.checkRestrictions(actionType, context);
    }

    public checkRestrictions(actionType: string, context?: AbilityContext) {
        return !this.getEffects(EffectNames.AbilityRestrictions).some((restriction) =>
            restriction.isMatch(actionType, context, this)
        );
    }

    public isTemptationsMaho() {
        return false;
    }

    public getShortSummary() {
        return {
            id: this.id,
            label: this.id,
            name: this.id,
            facedown: false,
            type: '',
            uuid: this.uuid
        };
    }

    public canBeTargeted(context: AbilityContext, selectedCards: GameObject | GameObject[] = []) {
        if (!this.checkRestrictions('target', context)) {
            return false;
        }
        let targets = selectedCards;
        if (!Array.isArray(targets)) {
            targets = [targets];
        }

        targets = targets.concat(this);
        let targetingCost = context.player.getTargetingCost(context.source, targets);

        if (context.stage === Stages.PreTarget || context.stage === Stages.Cost) {
            //We haven't paid the cost yet, so figure out what it will cost to play this so we can know how much fate we'll have available for targeting
            let fateCost = 0;
            // @ts-ignore
            if (context.ability.getReducedCost) {
                //we only want to consider the ability cost, not the card cost
                // @ts-ignore
                fateCost = context.ability.getReducedCost(context);
            }
            let alternateFate = context.player.getAvailableAlternateFate(context.playType, context);
            let availableFate = Math.max(context.player.fate - Math.max(fateCost - alternateFate, 0), 0);

            return (
                availableFate >= targetingCost &&
                (targetingCost === 0 || context.player.checkRestrictions('spendFate', context))
            );
        } else if (context.stage === Stages.Target || context.stage === Stages.Effect) {
            //We paid costs first, or targeting has to be done after costs have been paid
            return (
                context.player.fate >= targetingCost &&
                (targetingCost === 0 || context.player.checkRestrictions('spendFate', context))
            );
        }

        return true;
    }

    public getShortSummaryForControls(activePlayer: Player):
        | {
              facedown: boolean;
              isDynasty: boolean;
              isConflict: boolean;
          }
        | {
              id: string;
              label: string;
              name: string;
              facedown: boolean;
              type: string;
              uuid: string;
          } {
        return this.getShortSummary();
    }

    public mostRecentEffect(type: EffectNames) {
        const effects = this.getEffects(type);
        return effects[effects.length - 1];
    }

    public getRawEffects() {
        const suppressEffects = this.effects.filter((effect) => effect.type === EffectNames.SuppressEffects);
        const suppressedEffects = suppressEffects.reduce((array, effect) => array.concat(effect.getValue(this)), []);
        return this.effects.filter((effect) => !suppressedEffects.includes(effect));
    }
}