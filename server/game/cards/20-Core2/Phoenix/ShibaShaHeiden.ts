import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShibaShaHeiden extends DrawCard {
    static id = 'shiba-sha-heiden';

    setupCardAbilities() {
        /**
         * The card is a single action, but implementing the cost was too much work
         * Should be fixed later when choice costs are implemented
         */

        const sharedLimit = AbilityDsl.limit.perRound(1);
        this.action({
            title: 'Pay 1 fate to draw a card',
            cost: AbilityDsl.costs.payFate(1),
            gameAction: AbilityDsl.actions.draw(),
            limit: sharedLimit
        });
        this.action({
            title: 'Discard a card to gain 1 fate',
            cost: AbilityDsl.costs.discardCard(),
            gameAction: AbilityDsl.actions.gainFate(),
            limit: sharedLimit
        });
        this.action({
            title: 'Discard a card to draw a card',
            cost: AbilityDsl.costs.discardCard(),
            gameAction: AbilityDsl.actions.draw(),
            limit: sharedLimit
        });
    }
}
