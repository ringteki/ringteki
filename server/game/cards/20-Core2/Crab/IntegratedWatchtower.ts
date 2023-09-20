import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class IntegratedWatchtower extends DrawCard {
    static id = 'integrated-watchtower';

    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            condition: (context) => context.player.isDefendingPlayer(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}
