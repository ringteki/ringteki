import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Coward extends DrawCard {
    static id = 'coward-';

    public setupCardAbilities() {
        this.duelChallenge({
            title: 'Dishonor a character',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                cardType: CardTypes.Character,
                controller: Players.Any,
                hidePromptIfSingleCard: true,
                cardCondition: (card) => {
                    const isInvolved = context.event.duel.isInvolved(card);
                    const isChallenger = context.event.duel.challenger === card;
                    const higherSkill = context.event.duel.targets.some(target =>
                        context.event.duel.getSkillStatistic(card) > context.event.duel.getSkillStatistic(target)
                    );

                    return isInvolved && isChallenger && higherSkill;
                },
                message: '{0} dishonors {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.dishonor()
            })),
            effect: 'dishonor a duel challenger'
        });

        this.reaction({
            title: 'Dishonor a character',
            when: {
                onConflictPass: (event, context) =>
                    event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}
