import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ProvinceBuff extends DrawCard {
    static id = 'province-buff';

    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} increases the strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(4)
                })
            })),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
