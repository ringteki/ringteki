import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KuniLookot extends DrawCard {
    static id = 'kuni-lookout';

    public setupCardAbilities() {
        this.reaction({
            title: 'Move a defender to the conflict',
            when: {
                onConflictStarted: (event, context) => (context.source as DrawCard).isAttacking()
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to move to the conflict',
                cardCondition: (card: DrawCard) => !card.bowed && card.statusTokens.length > 0,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}
