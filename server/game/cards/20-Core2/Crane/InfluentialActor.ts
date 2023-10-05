import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class InfluentialActor extends DrawCard {
    static id = 'influential-actor';

    setupCardAbilities() {
        this.action({
            title: 'Move a status token',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.selectToken((context) => ({
                    card: context.source,
                    activePromptTitle: 'Which token do you wish to move?',
                    message: '{0} moves {1} to {2}',
                    messageArgs: (token, player) => [player, token, context.target],
                    gameAction: AbilityDsl.actions.moveStatusToken(() => ({
                        recipient: context.target
                    }))
                }))
            },
            effect: 'move a status token on it to {0}'
        });
    }
}
