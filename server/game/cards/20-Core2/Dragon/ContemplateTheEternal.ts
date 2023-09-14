import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ContemplateTheEternal extends DrawCard {
    static id = 'contemplate-the-eternal';

    public setupCardAbilities() {
        this.action({
            title: 'Return rings to gain honor',
            cost: AbilityDsl.costs.returnRings(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.placeFate(context => ({
                    amount: context.costs.returnRing ? context.costs.returnRing.length : 1
                }))
            },
        });
    }
}
