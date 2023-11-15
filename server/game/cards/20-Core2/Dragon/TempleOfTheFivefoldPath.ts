import { TargetModes } from '../../../Constants';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';

export default class TempleOfTheFivefoldPath extends StrongholdCard {
    static id = 'temple-of-the-fivefold-path';

    setupCardAbilities() {
        this.action({
            title: 'Manipulate fate on rings',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring to receive fate',
                ringCondition: (ring) => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.ring.getFate() === 0,
                    trueGameAction: AbilityDsl.actions.placeFateOnRing(),
                    falseGameAction: AbilityDsl.actions.selectRing((context) => ({
                        activePromptTitle: 'Choose a donor ring',
                        ringCondition: (ring, context) => ring !== context.ring && ring.isUnclaimed(),
                        subActionProperties: (donorRing) => ({ target: context.ring, origin: donorRing }),
                        gameAction: AbilityDsl.actions.placeFateOnRing(),
                        message: '{0} moves 1 fate from the {1} to the {2}',
                        messageArgs: (ring, player) => [player, ring, context.ring]
                    }))
                })
            },
            effect: 'examine the mysteries of the {0} in search for guidance{1}',
            effectArgs: (context) => [context.ring.getFate() === 0 ? ', placing 1 fate on that ring' : '']
        });
    }
}