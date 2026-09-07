import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DesperateDefense extends DrawCard {
    static id = 'desperate-defense';

    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: (context) => context.player.cardsInPlay.some((card: DrawCard) => card.isParticipating()),
            effect: 'increase the strength of an attacked province by 3',
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
                    effect: AbilityDsl.effects.modifyProvinceStrength(3)
                })
            })),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
