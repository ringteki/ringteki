import { TargetModes } from '../../../Constants';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';

export default class DragonBox extends StrongholdCard {
    static id = 'dragon-box';

    setupCardAbilities() {
        this.action({
            title: 'Resolve another ring effect',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring) => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.ring.getFate() === 0,
                    trueGameAction: AbilityDsl.actions.placeFateOnRing(),
                    falseGameAction: AbilityDsl.actions.selectRing((context) => ({
                        ringCondition: (ring, context) => ring !== context.ring && ring.isUnclaimed(),
                        gameAction: AbilityDsl.actions.placeFateOnRing({ origin: context.ring }),
                        message: '{0} moves 1 fate from the {1} to the {2}',
                        messageArgs: (ring, player) => [player, context.ring, ring]
                    }))
                })
            },
            effect: 'examine the mysteries of the {0} in search for guidance{1}',
            effectArgs: (context) => [context.ring.getFate() === 0 ? ', placing 1 fate on that ring' : '']
        });
    }
}
