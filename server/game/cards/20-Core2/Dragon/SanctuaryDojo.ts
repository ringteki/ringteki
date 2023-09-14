import { CardTypes, Players, Durations, DuelTypes, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SanctuaryDojo extends DrawCard {
    static id = 'sanctuary-dojo';

    public setupCardAbilities() {
        this.action({
            title: 'Ready character and move to conflict',
            condition: context => context.player.isDefendingPlayer(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('duelist'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveToConflict()
                ])
            },
            effect: 'ready {0} and move it into the conflict'
        });
    }
}
