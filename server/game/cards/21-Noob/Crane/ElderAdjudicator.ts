import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class ElderAdjudicator extends DrawCard {
    static id = 'elder-adjudicator';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.game.allCards.some(
                    (card: BaseCard) =>
                        card instanceof DrawCard &&
                        card.type === CardTypes.Character &&
                        card.isParticipating() &&
                        card.printedCost > context.source.printedCost
                ),
            effect: [AbilityDsl.effects.modifyBothSkills(-2)]
        });
    }
}
