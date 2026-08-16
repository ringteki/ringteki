import DrawCard from '../../../DrawCard.js';
import { Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ManipulativeScout extends DrawCard {
    static id = 'manipulative-scout';

    setupCardAbilities() {
        this.action({
            title: 'Flip a card in a province',
            target: {
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: card => card.isDynasty,
                gameAction: [AbilityDsl.actions.flipDynasty(), AbilityDsl.actions.turnFacedown()]
            }
        });
    }
}
