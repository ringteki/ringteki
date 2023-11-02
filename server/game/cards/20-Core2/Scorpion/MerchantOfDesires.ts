import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class MerchantOfDesires extends DrawCard {
    static id = 'merchant-of-desires';

    setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            cost: [AbilityDsl.costs.payHonor(1), AbilityDsl.costs.optionalOpponentLoseHonor()],
            gameAction: AbilityDsl.actions.draw((context) => ({
                amount: 1,
                target: context.costs.optionalOpponentLoseHonorPaid
                    ? [context.player, context.player.opponent]
                    : context.player
            }))
        });
    }
}
