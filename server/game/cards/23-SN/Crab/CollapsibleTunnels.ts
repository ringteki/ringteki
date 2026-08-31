import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class CollapsibleTunnels extends DrawCard {
    static id = 'collapsible-tunnels';

    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: (context) => context.game.isDuringConflict(),
            effect: 'increase the strength of an attacked province by 2',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} increases the strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(2)
                })
            }))
        });

        this.action({
            title: 'Bow a character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking() && card.getBaseMilitarySkill() <= 2,
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
