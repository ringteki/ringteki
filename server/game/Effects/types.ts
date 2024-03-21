import type { AbilityContext } from '../AbilityContext';
import type { EffectNames } from '../Constants';
import type { GameObject } from '../GameObject';

export interface CardEffect {
    context: AbilityContext
    type: EffectNames;
    value: any;
    getValue: <T = any>(obj?: GameObject) => T;
}
