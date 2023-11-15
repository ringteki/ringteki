import { AbilityTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityProps } from '../../../Interfaces';

export default class CollectorOfFavors extends DrawCard {
    static id = 'collector-of-favors';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Gain a fate',
                when: {
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller &&
                        context.source.isParticipating() &&
                        context.source.hasTrait('courtier')
                },
                gameAction: AbilityDsl.actions.gainFate()
            } as TriggeredAbilityProps)
        });
    }
}
