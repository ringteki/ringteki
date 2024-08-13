import AbilityDsl from '../../../abilitydsl';
import BaseCard from '../../../basecard';
import { CardTypes, Locations } from '../../../Constants';
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
                        card.location === Locations.PlayArea &&
                        card.isFaceup() &&
                        card.printedCost > context.source.printedCost
                ),
            effect: [AbilityDsl.effects.modifyBothSkills(-2)]
        });
    }
}
