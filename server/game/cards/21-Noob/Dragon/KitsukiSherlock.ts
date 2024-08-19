import { DuelTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KitsukiSherlock extends DrawCard {
    static id = 'kitsuki-sherlock';

    public setupCardAbilities() {
        this.duelChallenge({
            title: 'Punish the injust',
            duelCondition: (duel, context) =>
                duel.participants.includes(context.source) &&
                duel.participants.some(
                    (participant) => participant.controller === context.player.opponent && participant.isDishonored
                ),
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as any).event.duel,
                effect: AbilityDsl.effects.modifyDuelSkill({
                    amount: 2,
                    player: context.player
                }),
                duration: Durations.UntilEndOfDuel
            })),
            effect: 'add 2 to their duel total'
        });

        this.action({
            title: 'Initiate a military duel to bow',
            condition: (context) => context.source.isParticipating(),
            initiateDuel: {
                type: DuelTypes.Political,
                refuseGameAction: AbilityDsl.actions.lookAt((context) => ({
                    target: context.player.opponent.hand.sortBy((card: DrawCard) => card.name),
                    chatMessage: true,
                    message: '{0} reveals their hand: {1}',
                    messageArgs: (cards) => [context.player.opponent, cards]
                })),
                refusalMessage: '{0} chooses to refuse the duel and reveals their hand',
                refusalMessageArgs: (context) => [context.player.opponent],
                gameAction: (duel) => AbilityDsl.actions.discardAtRandom({ amount: 1, target: duel.loser })
            }
        });
    }
}