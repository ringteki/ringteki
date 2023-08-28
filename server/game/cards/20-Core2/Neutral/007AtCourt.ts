import { ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class _007AtCourt extends DrawCard {
    static id = '007-at-court';

    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to discard 2 cards',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player && event.conflict.conflictType === ConflictTypes.Political
            },
            cost: AbilityDsl.costs.dishonor({
                optional: true,
                cardCondition: (card) => card.isParticipating()
            }),
            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => context.costs.dishonor instanceof DrawCard,
                trueGameAction: AbilityDsl.actions.discardAtRandom((context) => ({
                    amount: 2,
                    target: context.player.opponent
                })),
                falseGameAction: AbilityDsl.actions.chosenDiscard((context) => ({
                    amount: 2,
                    target: context.player.opponent
                }))
            }),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
