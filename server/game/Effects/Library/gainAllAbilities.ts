import type BaseCard from '../../basecard';
import { EffectNames } from '../../Constants';
import EffectBuilder from '../EffectBuilder';
import GainAllAbilities from '../GainAllAbilities';

export type GainAllAbilitiesValue = GainAllAbilities;

export function gainAllAbilities(character: BaseCard) {
    return EffectBuilder.card.static(EffectNames.GainAllAbilities, new GainAllAbilities(character));
}