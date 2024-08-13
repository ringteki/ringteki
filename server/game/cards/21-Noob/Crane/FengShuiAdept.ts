import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class FengShuiAdept extends DrawCard {
    static id = 'feng-shui-adept';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            cost: AbilityDsl.costs.returnRings(1),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
