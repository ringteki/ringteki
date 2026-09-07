import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import CardSelector from '../../../CardSelector.js';
import { Location, Players, CardType } from '../../../Constants.js';

export default class TimeForWar2 extends DrawCard {
    static id = 'time-for-war-evolved';

    setupCardAbilities() {
        const attachAction = AbilityDsl.actions.attach();
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    selector: CardSelector.for({
                        activePromptTitle: 'Choose an attachment',
                        cardType: CardType.Attachment,
                        location: [Location.ConflictDiscardPile, Location.Hand],
                        controller: Players.Self,
                        cardCondition: (card: DrawCard) => card.costLessThan(4) && attachAction.canAffect(context.target, context, { attachment: card })
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (card, player) => [player, card, context.target],
                    subActionProperties: card => ({ attachment: card }),
                    gameAction: attachAction
                }))
            },
            effect: 'attach a weapon to {0}'
        });
    }
}
