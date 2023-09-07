import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KaitoYoshiaki extends DrawCard {
    static id = 'kaito-constantine';

    setupCardAbilities() {
        this.action({
            title: 'Punish the wicked or support the weak',
            target: {
                cardType: CardTypes.Character,
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
