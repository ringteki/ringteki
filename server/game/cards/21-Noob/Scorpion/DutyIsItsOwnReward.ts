import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DutyIsItsOwnReward extends DrawCard {
    static id = 'duty-is-its-own-reward';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.discardStatusToken({
                cardCondition: (card) => card.isHonored
            }),
            gameAction: AbilityDsl.actions.ready((context) => ({ target: context.source }))
        });
    }
}
