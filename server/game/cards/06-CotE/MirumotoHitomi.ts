import { CardTypes, DuelTypes, Players, TargetModes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';
import DrawCard from '../../drawcard';

export default class MirumotoHitomi extends DrawCard {
    static id = 'mirumoto-hitomi';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                mode: TargetModes.UpTo,
                numCards: 2,
                gameAction: AbilityDsl.actions.duel((context) => ({
                    type: DuelTypes.Military,
                    challenger: context.source,
                    message: '{0} chooses whether to dishonor or bow {1}',
                    messageArgs: (duel) => [
                        context.source === duel.winner ? context.player.opponent : context.player,
                        duel.loser
                    ],
                    gameAction: (duel) =>
                        duel.loser &&
                        AbilityDsl.actions.multiple(
                            [].concat(duel.loser).map((card) =>
                                AbilityDsl.actions.chooseAction({
                                    target: card,
                                    player: context.player !== card.controller ? Players.Opponent : Players.Self,
                                    options: {
                                        'Dishonor this character': {
                                            action: AbilityDsl.actions.dishonor(),
                                            message: '{0} chooses to dishonor {1}'
                                        },
                                        'Bow this character': {
                                            action: AbilityDsl.actions.bow(),
                                            message: '{0} chooses to bow {1}'
                                        }
                                    }
                                })
                            )
                        )
                }))
            }
        });
    }
}
