import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class EagerOperative extends DrawCard {
    static id = 'eager-operative';

    setupCardAbilities() {
        this.action({
            title: 'Lose 1 honor to ready me',
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}
