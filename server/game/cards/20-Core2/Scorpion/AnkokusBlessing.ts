import { Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AnkokusBlessing extends DrawCard {
    static id = 'ankoku-s-blessing';

    setupCardAbilities() {
        this.action({
            title: 'Gain 2 fate and draw 2 cards',
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.draw({ amount: 2 }),
                AbilityDsl.actions.gainFate({ amount: 2 })
            ]),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
