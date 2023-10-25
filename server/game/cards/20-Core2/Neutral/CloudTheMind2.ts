import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import TriggeredAbilityContext from '../../../TriggeredAbilityContext';

export default class CloudTheMind2 extends DrawCard {
    static id = 'cloud-the-mind-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.blank()
        });
    }

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.any(
                (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
