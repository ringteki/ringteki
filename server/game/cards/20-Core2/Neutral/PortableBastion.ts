import { AbilityTypes, CardTypes, Locations, Players } from '../../../Constants';
import type TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import type BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class PortableBastion extends DrawCard {
    static id = 'portable-bastion';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'shugenja' });

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: BaseCard) => target.type === CardTypes.Character && target.hasTrait('earth'),
                match: (card: BaseCard, source: any) => card === source
            })
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.WouldInterrupt, {
                title: 'Move a character to the conflict',
                when: {
                    onMoveToConflict: (event: any, context: TriggeredAbilityContext) =>
                        event.card.type === CardTypes.Character && context.source.isParticipating()
                },
                effect: "deny {1}'s movement",
                effectArgs: (context: TriggeredAbilityContext) => [context.event.card],
                gameAction: AbilityDsl.actions.cancel()
            })
        });
    }
}
