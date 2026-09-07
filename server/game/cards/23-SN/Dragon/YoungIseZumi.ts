import { Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class YoungIseZumi extends DrawCard {
    static id = 'young-ise-zumi';

    public setupCardAbilities() {
        this.reaction({
            title: 'Prevent a ring from being used for a conflict',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            cost: AbilityDsl.costs.payFateToRing(1, () => true),
            gameAction: AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.costs.placeFate || context.game.rings.air,
                effect: AbilityDsl.effects.cannotDeclareRing(() => true)
            })),
            effect: 'prevent conflicts from being declared with the {1}',
            effectArgs: context => [context.costs.placeFate] as any
        });
    }
}
