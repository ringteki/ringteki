import { CardTypes } from '../../../Constants';
import type TriggeredAbilityContext from '../../../TriggeredAbilityContext';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class EarthsStagnation extends DrawCard {
    static id = 'earth-s-stagnation';

    public setupCardAbilities() {
        this.forcedReaction({
            title: 'Give attached character a skill penalty',
            when: {
                onCardPlayed: (event, context) =>
                    context.source.parent &&
                    (event.card as DrawCard).type === CardTypes.Event &&
                    context.source.parent.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#penaltyAmount(context))
            })),
            effect: 'give {1}{2} to {3}',
            effectArgs: (context) => [this.#penaltyAmount(context), 'military', context.source.parent],
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    #penaltyAmount(context: TriggeredAbilityContext): number {
        return context.player.hasAffinity('earth', context) ? -2 : -1;
    }
}
