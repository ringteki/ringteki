import { EffectNames } from '../../Constants';
import type { Conflict } from '../../conflict';
import type DrawCard from '../../drawcard';
import { EffectBuilder } from '../EffectBuilder';

export type ChangeConflictSkillFunctionValue = (card: DrawCard, conflict: Conflict) => number;

export function changeConflictSkillFunctionPlayer(func: ChangeConflictSkillFunctionValue) {
    // @TODO: Add this to lasting effect checks
    return EffectBuilder.player.static(EffectNames.ChangeConflictSkillFunction, func);
}

export function changeConflictSkillFunction(func: ChangeConflictSkillFunctionValue) {
    // @TODO: Add this to lasting effect checks
    return EffectBuilder.conflict.static(EffectNames.ChangeConflictSkillFunction, func);
}
