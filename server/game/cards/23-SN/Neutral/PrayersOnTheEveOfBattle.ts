import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class PrayersOnTheEveOfBattle extends DrawCard {
    static id = 'prayers-on-the-eve-of-battle';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Reap your rewards',
            when: {
                afterConflict: (event, context) => context.source.parent && context.source.parent.isParticipating()
            },
            gameAction: AbilityDsl.actions.conditional(context => ({
                condition: context.event.conflict.winner === context.source.parent.controller,
                trueGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.gainFate({
                        amount: 1,
                        target: context.player
                    }),
                    AbilityDsl.actions.discardFromPlay({
                        target: context.source
                    })
                ]),
                falseGameAction: AbilityDsl.actions.removeFromGame({
                    target: context.source
                })
            }))
        });

        this.reaction({
            title: 'Return to hand',
            location: Location.ConflictDiscardPile,
            when: {
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({ target: context.source, destination: Location.Hand })),
            max: AbilityDsl.limit.perConflictOpportunity(1),
        });
    }
}
