import { CardTypes, Locations, Players } from '../../../Constants';
import type TriggeredAbilityContext from '../../../TriggeredAbilityContext';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class CompositeYumi extends DrawCard {
    static id = 'composite-yumi';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: BaseCard) =>
                    target.type === CardTypes.Character && target.hasTrait('cavalry'),
                match: (card: BaseCard, source: BaseCard) => card === source
            })
        });

        this.reaction({
            title: 'Give attached character +1/+0',
            when: {
                onMoveToConflict: (event, context) => this.#matchCondition(event.card, context),
                onCharacterEntersPlay: (event, context) => this.#matchCondition(event.card, context)
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            })),
            effect: 'give +1{1} to {2}',
            effectArgs: (context) => ['military', context.source.parent],
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    #matchCondition(card: DrawCard, context: TriggeredAbilityContext) {
        return (
            context.source.parent &&
            card.type === CardTypes.Character &&
            card.isParticipating('military') &&
            context.source.parent.isParticipating('military')
        );
    }
}
