import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class PromisingKohai extends DrawCard {
    static id = 'promising-kohai';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Help a character with a duel',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => {
                    const isInvolved = context.event.duel.isInvolved(card);
                    const higherCost = card.printedCost > context.source.printedCost;

                    return higherCost && isInvolved;
                },
                message: '{0} gives {1} 2 bonus skill for this duel',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyDuelSkill(2, context.event.duel),
                    duration: Durations.UntilEndOfDuel
                }))
            })),
            effect: 'help win a duel'
        });
    }
}
