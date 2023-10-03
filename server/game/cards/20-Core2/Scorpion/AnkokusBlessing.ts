import { Locations, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AnkokusBlessing extends DrawCard {
    static id = 'ankoku-s-blessing';

    setupCardAbilities() {
        this.action({
            title: 'Gain 2 fate and draw 2 cards',
            phase: Phases.Fate,
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.draw((context) => ({ target: context.player, amount: 2 })),
                AbilityDsl.actions.gainFate((context) => ({ target: context.player, amount: 2 }))
            ]),
            max: AbilityDsl.limit.perRound(1),
            effect: 'draw 2 cards and gain 2 fate'
        });
    }
}
