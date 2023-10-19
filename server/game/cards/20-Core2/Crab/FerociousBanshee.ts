import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class FerociousBanshee extends DrawCard {
    static id = 'ferocious-banshee';

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
