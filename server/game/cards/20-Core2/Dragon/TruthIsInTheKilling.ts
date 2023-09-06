import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TruthIsInTheKilling extends DrawCard {
    static id = 'truth-is-in-the-killing';

    setupCardAbilities() {
        this.duelStrike({
            title: 'Discard a character',
            duelCondition: (duel, context) => {
                const allCharacters: DrawCard[] = [duel.challenger, ...duel.targets];
                const youHaveDuelist = allCharacters.filter(a => a.hasTrait('duelist') && a.controller === context.player).length > 0;
                return youHaveDuelist;
            },
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Character,
                cardCondition: card => context.event.duel.loser.includes(card),
                message: '{0} discards {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.discardFromPlay(),
            })),
            effect: 'discard a loser of the duel'
        });

        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   event.conflict.skillDifference >= 5
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
