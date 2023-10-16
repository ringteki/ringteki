import { CardTypes, Durations, PlayTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UtakuSumire extends DrawCard {
    static id = 'utaku-sumire';

    setupCardAbilities() {
        this.reaction({
            title: "Don't play cards. Place fate on up to 3 characters on win",
            when: {
                onConflictStarted: (_, context) => context.source.isAttacking()
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect({
                    targetController: Players.Self,
                    effect: AbilityDsl.effects.playerCannot({
                        cannot: PlayTypes.PlayFromHand
                    })
                }),
                AbilityDsl.actions.playerLastingEffect({
                    duration: Durations.UntilEndOfConflict,
                    targetController: Players.Self,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            afterConflict: (event, context) => event.conflict.winner === context.player
                        },
                        gameAction: AbilityDsl.actions.selectCard({
                            cardType: CardTypes.Character,
                            controller: Players.Self,
                            player: Players.Self,
                            mode: TargetModes.UpTo,
                            numCards: 3,
                            gameAction: AbilityDsl.actions.placeFate()
                        })
                    })
                })
            ])
        });
    }
}
