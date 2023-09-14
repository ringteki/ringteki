import { Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AgashaFoundry extends DrawCard {
    static id = 'agasha-foundry';

    public setupCardAbilities() {
        this.action({
            title: 'Search for a card',
            cost: AbilityDsl.costs.payFateToRing(),
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: (card, context) => card.hasTrait('spell') || card.hasTrait('kiho'),
                shuffle: true,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}
