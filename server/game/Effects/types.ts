import type { EffectNames } from '../Constants';
import type { GameObject } from '../GameObject';

export interface CardEffect {
    type: EffectNames;
    getValue: <T = any>(obj: GameObject) => T;
}
