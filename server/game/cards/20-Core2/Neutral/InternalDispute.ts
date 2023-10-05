import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { Conflict } from '../../../conflict';

export default class InternalDispute extends DrawCard {
    static id = 'internal-dispute';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) =>
                (context.game.currentConflict as Conflict | undefined)?.getParticipants(
                    (card) => card.controller !== context.source && card.isUnique()
                ).length >= 2,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isUnique() && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
