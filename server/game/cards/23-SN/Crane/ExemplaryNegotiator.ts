import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';

export default class ExemplaryNegotiator extends DrawCard {
    static id = 'exemplary-negotiator';

    setupCardAbilities() {
        this.action({
            title: 'Discard cards to cause opponent to discard',
            condition: context => context.player.anyCardsInPlay(card => card.isDishonored),
            cost: AbilityDsl.costs.discardCardsUpToVariableX(() => 2),
            gameAction: AbilityDsl.actions.discardAtRandom(context => ({
                amount: (context.costs.discardCardsUpToVariableX as BaseCard[])?.length || 1,
                target: context.player.opponent
            })),
            effect: 'discard {1} to make {2} discard {3} card{4} at random',
            effectArgs: (context) => [
                context.costs.discardCardsUpToVariableX as BaseCard[],
                context.player.opponent,
                (context.costs.discardCardsUpToVariableX as BaseCard[]).length,
                (context.costs.discardCardsUpToVariableX as BaseCard[]).length > 1 ? 's' : ''
            ],
        });
    }
}
