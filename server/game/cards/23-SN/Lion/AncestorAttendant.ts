import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AncestorAttendant extends DrawCard {
    static id = 'ancestor-attendant';

    setupCardAbilities() {
        this.conflictAction<DrawCard>({
            title: 'Dishonor a character',
            target: {
                // Printed cost 0 discards nothing, so "if you do" is never satisfied and
                // the ability cannot change the game state at all.
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    (card.printedCost ?? 0) > 0 &&
                    context.player.dynastyDeck.length >= (card.printedCost ?? 0),
                cardType: CardType.Character,
                // Not joint: the discard is what "if you do" refers to, so a character
                // that cannot be dishonored is still a legal choice and still costs the
                // cards. Discard first, as printed.
                gameAction: AbilityDsl.actions.multipleContext(context => ({
                    gameActions: [
                        AbilityDsl.actions.discardCard((discardContext) => ({
                            target: discardContext.player.dynastyDeck.slice(0, context.target.printedCost || 0)
                        })),
                        AbilityDsl.actions.dishonor()
                    ]
                }))
            },
            effect: 'dishonor {0} and discard the top {1} cards of their dynasty deck',
            effectArgs: (context) => [context.target?.printedCost]
        });
    }
}
