import { CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import type DrawCard = require('../../../drawcard');
import ProvinceCard = require('../../../provincecard');

export default class AntelopeCanyon extends ProvinceCard {
    static id = 'antelope-canyon';

    public setupCardAbilities() {
        this.action({
            title: "Look at random cards from opponent's hand",
            target: {
                activePromptTitle: 'Choose a character to lead the investigation',
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isDefending() && context.player.opponent !== undefined
            },
            gameAction: AbilityDsl.actions.lookAt((context) => ({
                target: context.player.opponent.hand
                    .shuffle()
                    .slice(0, (context.target as DrawCard).getCost())
                    .sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)),
                message: '{0} uses {1} with {2}. It reveals {3}',
                messageArgs: (cards) => [context.player, context.source, context.target, cards]
            }))
        });
    }
}
