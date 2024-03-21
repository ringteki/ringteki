import { EffectNames } from '../../Constants';
import type { Faction } from '../../Interfaces';
import { EffectBuilder } from '../EffectBuilder';

export function addFaction(faction: Faction) {
    return EffectBuilder.card.static(EffectNames.AddFaction, faction);
}