import type AbilityContext from '../../../AbilityContext';
import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class JadeInfusedArrows extends DrawCard {
    static id = 'jade-infused-arrows';

    setupCardAbilities() {
        this.action({
            title: 'Give attached character a skill bonus',
            condition: (context) => context.game.isDuringConflict() && context.source.parent?.isParticipating(),
            cost: AbilityDsl.costs.payFate(1),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#bonusAmount(context))
            })),
            effect: 'give +{1}{2} to {3}',
            effectArgs: (context) => [this.#bonusAmount(context), 'military', context.source.parent],
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    #bonusAmount(context: AbilityContext): number {
        return context.player.opponent?.cardsInPlay.any(
            (card: DrawCard) =>
                card.getType() === CardTypes.Character &&
                card.isParticipating() &&
                (card.isTainted || card.hasTrait('shadowlands') || card.hasTrait('haunted'))
        )
            ? 4
            : 2;
    }
}
