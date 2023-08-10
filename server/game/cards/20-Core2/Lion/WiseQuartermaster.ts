import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class WiseQuartermaster extends DrawCard {
    static id = 'wise-quartermaster';

    setupCardAbilities() {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.selectCard((context) => ({
                    controller: Players.Self,
                    cardCondition: (card) => card !== context.target.parent,
                    message: '{0} moves {1} to {2}',
                    messageArgs: (card) => [context.player, context.target, card],
                    gameAction: AbilityDsl.actions.attach({ attachment: context.target })
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}
