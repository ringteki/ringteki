import AbilityDsl from '../../../abilitydsl';
import { Conflict } from '../../../conflict';
import { CardTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class KaiuForeman extends DrawCard {
    static id = 'kaiu-foreman';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                (context.game.currentConflict as undefined | Conflict)?.anyParticipants((card) =>
                    card.hasTrait('cavalry')
                ),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Move a character into or out of the conflict',
            condition: (context) => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                gameAction: [AbilityDsl.actions.sendHome(), AbilityDsl.actions.moveToConflict()]
            }
        });
    }
}