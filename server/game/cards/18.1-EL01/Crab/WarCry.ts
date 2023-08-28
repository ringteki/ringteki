import { ConflictTypes, CardTypes, Locations } from '../../../Constants';
import type { ProvinceCard } from '../../../ProvinceCard';
import type TriggeredAbilityContext from '../../../TriggeredAbilityContext';
import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class WarCry extends DrawCard {
    static id = 'war-cry';

    setupCardAbilities() {
        this.reaction({
            title: 'Break the attacked province',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    this.#areAllAttackersBerserker(event.conflict) &&
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.conflictType === ConflictTypes.Military
            },
            effect: '{1}',
            effectArgs: (context) =>
                this.#isConflictNotAtStronghold(context) ? ['break an attacked province'] : ['draw a card'],
            gameAction: AbilityDsl.actions.ifAble((context) => ({
                ifAbleAction: AbilityDsl.actions.selectCard(() => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: (card) =>
                        card.isConflictProvince() && card.location !== Locations.StrongholdProvince,
                    message: '{0} breaks {1}',
                    messageArgs: (cards) => [context.player, cards],
                    gameAction: AbilityDsl.actions.breakProvince()
                })),
                otherwiseAction: AbilityDsl.actions.draw({ target: context.player, amount: 1 })
            }))
        });
    }

    #isConflictNotAtStronghold(context: TriggeredAbilityContext) {
        return context.game.currentConflict
            .getConflictProvinces()
            .some((a: ProvinceCard) => a.location !== Locations.StrongholdProvince);
    }

    #areAllAttackersBerserker(conflict: Conflict) {
        return conflict.attackers.every((a) => a.hasTrait('berserker'));
    }
}
