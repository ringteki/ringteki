import { CardTypes, EffectNames } from '../../Constants';
import { EffectBuilder } from '../EffectBuilder';

export type ChangeTypeValue = CardTypes;

export function changeType(type: ChangeTypeValue) {
    return EffectBuilder.card.static(EffectNames.ChangeType, type);
}