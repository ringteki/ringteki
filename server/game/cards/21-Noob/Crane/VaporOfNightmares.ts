import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class VaporOfNightmares extends DrawCard {
    static id = 'vapor-of-nightmares';

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.any(
                (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
