import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class TwistedSister extends DrawCard {
    static id = 'twisted-sister';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.source.isParticipating() &&
                context.player.anyCardsInPlay(
                    (otherCard: BaseCard) =>
                        otherCard !== context.source &&
                        otherCard.type === CardTypes.Character &&
                        otherCard.hasTrait('berserker') &&
                        otherCard.isInConflict()
                ),
            effect: AbilityDsl.effects.modifyMilitarySkill(3)
        });
    }
}
