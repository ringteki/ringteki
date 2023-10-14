import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class AMatsuComingOfAge extends DrawCard {
    static id = 'a-matsu-coming-of-age';

    setupCardAbilities() {
        this.reaction({
            title: 'Prove yourself worthy of a Matsu name',
            when: {
                onConflictDeclared: (event, context) =>
                    context.player === context.game.currentConflict.attackingPlayer &&
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 &&
                    context.game.currentConflict.getParticipants(
                        (participant) => participant.hasTrait('bushi') && participant.controller === context.player
                    ).length === 1
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => {
                const target = (context.game.currentConflict as Conflict).getParticipants(
                    (participant) => participant.controller === context.player
                )[0];

                return {
                    target,
                    effect: [
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event) =>
                                    event.conflict.winner !== target.controller && target.isParticipating()
                            },
                            gameAction: AbilityDsl.actions.discardFromPlay({ target }),
                            message: '{0} is discarded from play due to failing at {1}!',
                            messageArgs: (context) => [target, context.source]
                        }),
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event) =>
                                    event.conflict.winner === target.controller && target.isParticipating()
                            },
                            gameAction: AbilityDsl.actions.sequential([
                                AbilityDsl.actions.honor({ target }),
                                AbilityDsl.actions.placeFate({ target }),
                                AbilityDsl.actions.gainHonor({ target: context.source.controller }),
                                AbilityDsl.actions.draw({ target: context.source.controller })
                            ]),
                            message:
                                '{0} is honored and receives 1 fate, and {1} gains 1 fate and draw 1 card due to {0} succeeding at {2}!',
                            messageArgs: (context) => [target, context.source.controller, context.source]
                        })
                    ]
                };
            }),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}