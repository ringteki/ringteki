import { CardTypes, DuelTypes, Durations, FavorTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SeppunRyo extends DrawCard {
    static id = 'seppun-ryo';

    public setupCardAbilities() {
        this.duelFocus({
            title: 'Help a character with a duel',
            duelCondition: (duel, context) => context.player.imperialFavor !== '',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => context.event.duel.isInvolved(card),
                message: '{0} gives {1} 1 bonus skill for this duel',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyDuelistSkill(1, context.event.duel),
                    duration: Durations.UntilEndOfDuel
                }))
            })),
            effect: 'focus their duelist'
        });

        this.action({
            title: 'Initiate a military duel to bow',
            initiateDuel: {
                type: DuelTypes.Military,
                refuseGameAction: AbilityDsl.actions.claimImperialFavor((context) => ({
                    target: context.player.opponent?.imperialFavor !== '' ? context.player : null,
                    side: this.getFavorSide(context.player.opponent?.imperialFavor)
                })),
                refusalMessage: '{0} chooses to refuse the duel and give the imperial favor to {1}',
                refusalMessageArgs: (context) => [context.player.opponent, context.player],
                gameAction: (duel) => AbilityDsl.actions.bow({ target: duel.loser })
            }
        });
    }

    getFavorSide(favor: string) {
        switch (favor) {
            case 'military':
                return FavorTypes.Military;
            case 'political':
                return FavorTypes.Political;
            default:
                return FavorTypes.Both;
        }
    }
}
