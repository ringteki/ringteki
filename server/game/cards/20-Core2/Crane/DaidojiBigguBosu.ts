import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DaidojiBigguBosu extends DrawCard {
    static id = 'daidoji-biggu-bosu';

    setupCardAbilities() {
        this.action({
            title: 'Bow and dishonor a character',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.dishonor(),
                ])
            },
            effect: 'bow and dishonor {0}'
        });
    }
}
