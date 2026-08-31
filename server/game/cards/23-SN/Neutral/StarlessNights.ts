import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';
import { Phases } from '../../../Constants.js';

export default class StarlessNights extends DrawCard {
    static id = 'starless-nights';

    setupCardAbilities() {
        this.reaction({
            title: 'Place 1 fate on each unclaimed ring',
            when: {
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            },
            gameAction: AbilityDsl.actions.placeFateOnRing((context: AbilityContext) => ({
                target: Object.values(context.game.rings).filter(ring => ring.isUnclaimed())
            })),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
