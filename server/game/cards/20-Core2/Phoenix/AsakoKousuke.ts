import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AsakoKousuke extends DrawCard {
    static id = 'asako-kousuke';

    setupCardAbilities() {
        this.action({
            title: 'Treat the status token on a character as if it was another status token',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => (card as DrawCard).hasStatusTokens,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) =>
                        (context.target as DrawCard).isTainted || (context.target as DrawCard).hasTrait('shadowlands'),
                    trueGameAction: AbilityDsl.actions.removeFate(),
                    falseGameAction: AbilityDsl.actions.ready()
                })
            }
        });
    }
}
