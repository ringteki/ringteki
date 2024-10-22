import AbilityDsl from '../../../abilitydsl';
import { Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class NightBattle extends DrawCard {
    static id = 'night-battle';

    setupCardAbilities() {
        this.action({
            title: 'Increase cost to play cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'increase the cost of cards this conflict for both players',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect({
                    effect: AbilityDsl.effects.increaseCost({ amount: 1 }),
                    targetController: Players.Any
                }),
                AbilityDsl.actions.conditional({
                    condition: (context) =>
                        context.player.anyCardsInPlay((card: DrawCard) => card.hasTrait('shugenja')),
                    trueGameAction: AbilityDsl.actions.gainFate(),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            ]),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
