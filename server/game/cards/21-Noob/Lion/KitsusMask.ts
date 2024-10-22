import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { GameObject } from '../../../GameObject';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class KitsusMask extends DrawCard {
    static id = 'kitsu-s-mask';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.hasAffinity('water', context),
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.cardTargets.some((card: GameObject) => card === context.source.parent)
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.any(
                (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
