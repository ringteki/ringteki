import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Echoboy extends DrawCard {
    static id = 'echoboy';

    setupCardAbilities() {
        this.action({
            title: 'Resolve a ring effect',
            cost: AbilityDsl.costs.returnRings(1),
            gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({ target: context.costs.returnRing }))
        });
    }
}
