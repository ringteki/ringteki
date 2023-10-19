import { DuelTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UnyieldingTerms extends DrawCard {
    static id = 'unyielding-terms';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                requiresConflict: false,
                challengerCondition: (card) => card.hasTrait('duelist') && !card.bowed,
                refuseGameAction: AbilityDsl.actions.chosenDiscard((context) => ({
                    targets: false,
                    target: context.player.opponent,
                    amount: Math.floor(context.player.opponent.hand.value().length / 2)
                })),
                refusalMessage: '{0} chooses to refuse the duel and discard {1} cards from their hand',
                refusalMessageArgs: (context) => [
                    context.player.opponent,
                    Math.floor(context.player.opponent.hand.value().length / 2)
                ],
                gameAction: (duel) =>
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.dishonor({ target: duel.loser }),
                        AbilityDsl.actions.bow({ target: duel.loser }),
                        AbilityDsl.actions.cardLastingEffect({
                            target: duel.loser,
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.cardCannot({ cannot: 'ready' })
                        })
                    ]),
                message: 'bow and dishonor {0}, preventing them from readying for the rest of the phase',
                messageArgs: (duel) => duel.loser
            },
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
