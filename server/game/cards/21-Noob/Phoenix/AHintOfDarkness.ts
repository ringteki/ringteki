import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class AHintOfDarkness extends DrawCard {
    static id = 'a-hint-of-darkness';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove fate from a character who triggered an ability',
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.card.type === CardTypes.Character &&
                    event.card.controller === context.player.opponent &&
                    event.ability.isTriggeredAbility()
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.removeFate((context: any) => ({ target: context.event.card })),
            max: AbilityDsl.limit.perPhase(1)
        });
    }
}
