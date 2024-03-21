import type BaseCard from '../../basecard';
import { EffectNames, type Elements } from '../../Constants';
import { EffectBuilder } from '../EffectBuilder';

export type AddElementAsAttackerValue = (card: BaseCard) => Elements | 'none' | Array<Elements>;

export function addElementAsAttacker(element: AddElementAsAttackerValue) {
    return EffectBuilder.card.flexible(EffectNames.AddElementAsAttacker, element);
}