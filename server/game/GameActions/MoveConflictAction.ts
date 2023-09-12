import type AbilityContext from '../AbilityContext';
import { EventNames, CardTypes } from '../Constants';
import { ProvinceCard } from '../ProvinceCard';
import type BaseCard from '../basecard';
import { type CardActionProperties, CardGameAction } from './CardGameAction';

export interface MoveConflictProperties extends CardActionProperties {}

export class MoveConflictAction extends CardGameAction {
    name = 'moveConflict';
    eventName = EventNames.OnConflictMoved;
    targetType = [CardTypes.Province];
    effect = 'move the conflict to {0}';
    cost = 'moves the conflict to {0}';
    defaultProperties: MoveConflictProperties = {};
    constructor(properties: ((context: AbilityContext) => MoveConflictProperties) | MoveConflictProperties) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return (
            card instanceof ProvinceCard &&
            !card.isConflictProvince() &&
            card.canBeAttacked() &&
            context.game.isDuringConflict() &&
            context.game.currentConflict.getConflictProvinces().some((a) => a.controller === card.controller) &&
            super.canAffect(card, context)
        );
    }

    eventHandler(event, additionalProperties): void {
        const context = event.context;
        const newProvince = event.card;

        newProvince.inConflict = true;
        context.game.currentConflict.conflictProvince.inConflict = false;
        context.game.currentConflict.conflictProvince = newProvince;
        if (newProvince.isFacedown()) {
            const revealEvent = event.context.game.actions
                .reveal()
                .getEvent(newProvince, event.context.game.getFrameworkContext());
            event.context.game.openThenEventWindow(revealEvent);
        }
    }
}
