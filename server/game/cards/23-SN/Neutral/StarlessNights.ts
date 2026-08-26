import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class StarlessNights extends DrawCard {
    static id = 'starless-nights';

    setupCardAbilities() {
        this.action({
            title: 'Place or take fate from rings',
            gameAction: AbilityDsl.actions.placeFateOnRing((context: AbilityContext) => ({
                target: Object.values(context.game.rings).filter(ring => ring.isUnclaimed())
            })),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
