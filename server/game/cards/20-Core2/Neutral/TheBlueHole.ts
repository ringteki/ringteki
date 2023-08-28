import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class TheBlueHole extends ProvinceCard {
    static id = 'the-blue-hole';

    public setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            cost: AbilityDsl.costs.discardCard(),
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
