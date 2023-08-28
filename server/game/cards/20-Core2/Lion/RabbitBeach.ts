import { CardTypes, Players } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';

export default class RabbitBeach extends ProvinceCard {
    static id = 'rabbit-beach';

    setupCardAbilities() {
        this.action({
            title: 'Attacker moves a character to the conflict',
            target: {
                cardType: CardTypes.Character,
                controller: (context) => (context.player.isAttackingPlayer() ? Players.Self : Players.Opponent),
                player: (context) => (context.player.isAttackingPlayer() ? Players.Self : Players.Opponent),
                activePromptTitle: 'Choose a character to move to the conflict',
                cardCondition: (card: DrawCard) => !card.bowed,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}
