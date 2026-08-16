import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class TwilightAmbush extends DrawCard {
    static id = 'twilight-ambush';

    setupCardAbilities() {
        this.action({
            title: 'Sacrifice dishonored character to injure dishonored one',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: card => card.isDishonored
            }),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isDishonored,
                gameAction: AbilityDsl.actions.injure()
            },
            then: (context: AbilityContext) => ({
                message: '{0} is injured again because {2} is a Shinobi',
                messageArgs: () => [context.player.opponent, context.player.getNumberOfOpponentsFacedownProvinces()],
                thenCondition: () => (context.costs.sacrificeStateWhenChosen as DrawCard).hasTrait('shinobi'),
                gameAction: AbilityDsl.actions.injure({
                    target: context.target,
                })
            })
        });
    }
}
