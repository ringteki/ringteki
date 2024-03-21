import { EffectNames } from '../../Constants';
import { EffectBuilder } from '../EffectBuilder';

export function addTrait(trait: string) {
    return EffectBuilder.card.static(EffectNames.AddTrait, trait);
}