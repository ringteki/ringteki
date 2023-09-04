import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KakitaStudent extends DrawCard {
    static id = 'kakita-student';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Help a character with a duel',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => {
                    const isInvolved = context.event.duel.isInvolved(card);
                    const higherCost = card.printedCost > context.source.printedCost;

                    return higherCost && isInvolved;
                },
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyDuelSkill(2, context.event.duel),
                    duration: Durations.UntilEndOfDuel
                }))
            },
            effect: 'grant 2 bonus skill during the duel to {0}'
        });
    }
}
