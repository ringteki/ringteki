import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';
import StrongholdCard from '../../../strongholdcard';

export default class UnicornBox extends StrongholdCard {
    static id = 'unicorn-box';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: DrawCard) => !card.bowed,
                gameAction: AbilityDsl.actions.conditional(({ target }) => ({
                    condition: () => target.isParticipating(),
                    trueGameAction: AbilityDsl.actions.sendHome({ target }),
                    falseGameAction: AbilityDsl.actions.moveToConflict({ target })
                }))
            }
        });
    }
}
