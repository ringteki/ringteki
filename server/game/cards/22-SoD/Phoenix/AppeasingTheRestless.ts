import { TargetMode, Players, CardType } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import BaseCard from '../../../BaseCard.js';

export default class AppeasingTheRestless extends DrawCard {
    static id = 'appeasing-the-restless';

    setupCardAbilities() {
        this.action({
            title: 'Place fates on spirits',
            cost: AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('shugenja')
            }),
            cannotTargetFirst: true,
            effect: 'choose up to 3 spirits to place fate on{1}{2}',
            effectArgs: context => context.player.hasAffinity('void', context) ? ['', ''] : [' and injure ', context.costs.bow as DrawCard],
            condition: context => context.player.fate > 0 && context.player.checkRestrictions('spendFate', context) || !context.player.hasAffinity('void', context),
            gameAction: AbilityDsl.actions.multipleContext(context => {
                const gameActions = [];

                if(context.player.fate > 0 && context.player.checkRestrictions('spendFate', context)) {
                    gameActions.push(AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Select spirits',
                        targets: false,
                        mode: TargetMode.UpToVariable,
                        numCardsFunc: (context: AbilityContext) => context.player.fate,
                        optional: true,
                        cardType: CardType.Character,
                        controller: Players.Self,
                        cardCondition: card => card.hasTrait('spirit') && card.allowGameAction('placeFate', context),
                        message: '{0} moves fate from their pool onto {1}',
                        messageArgs: cards => [context.player, cards],
                        gameAction: AbilityDsl.actions.placeFate({
                            origin: context.player
                        })
                    })));
                }

                if(!context.player.hasAffinity('void', context)) {
                    gameActions.push(AbilityDsl.actions.conditional({
                        condition: () => (context.costs.bow?.getFate() ?? 0) === 0,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.costs.bow }),
                        falseGameAction: AbilityDsl.actions.removeFate({ target: context.costs.bow })
                    }));
                }

                return { gameActions };
            })
        });
    }
}
