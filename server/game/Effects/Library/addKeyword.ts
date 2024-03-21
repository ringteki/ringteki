import { EffectNames } from '../../Constants';
import type { PrintedKeyword } from '../../Interfaces';
import { EffectBuilder } from '../EffectBuilder';


export function addKeyword(keyword: PrintedKeyword) {
    return EffectBuilder.card.static(EffectNames.AddKeyword, keyword);
}