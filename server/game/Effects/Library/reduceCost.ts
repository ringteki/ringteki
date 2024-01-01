import type { AbilityContext } from '../../AbilityContext';
import type BaseCard from '../../basecard';
import { type CardTypes, EffectNames, type PlayTypes } from '../../Constants';
import type CostReducer from '../../costreducer';
import type Player from '../../player';
import EffectBuilder from '../EffectBuilder';

type Props = {
    cardType?: CardTypes;
    costFloor?: number;
    limit?: any;
    playingTypes?: PlayTypes;
    amount?: number | ((card: BaseCard, player: Player) => number);
    match?: (card: BaseCard, source: BaseCard) => boolean;
    targetCondition?: (target: BaseCard, context: BaseCard) => boolean;
};

export function reduceCost(properties: Props) {
    return EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (player: Player, context: AbilityContext) => player.addCostReducer(context.source, properties),
        unapply: (player: Player, context: AbilityContext, reducer: CostReducer) => player.removeCostReducer(reducer)
    });
}