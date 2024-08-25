import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class MercilessMagistrate extends DrawCard {
    static id = 'merciless-magistrate';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor or dishonor a character',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                choices: {
                    'Discard a random card from hand': AbilityDsl.actions.discardAtRandom((context) => ({
                        target: context.player.opponent
                    })),
                    'Dishonor a character you control': AbilityDsl.actions.selectCard({
                        effect: 'force {0} to dishonor one of their characters',
                        effectArgs: (context) => [context.player.opponent],
                        cardType: CardTypes.Character,
                        player: Players.Opponent,
                        controller: Players.Opponent,
                        gameAction: AbilityDsl.actions.dishonor(),
                        message: '{0} dishonors {1}',
                        messageArgs: (card, player) => [player, card]
                    })
                }
            }
        });
    }
}
