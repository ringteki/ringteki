import { TargetModes } from '../../../Constants';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';

export default class TempleOfTheFivefoldPath extends StrongholdCard {
    static id = 'temple-of-the-fivefold-path';

    setupCardAbilities() {
        const sharedLimit = AbilityDsl.limit.perRound(1);

        this.action({
            title: 'Place fate on a ring without fate',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                mode: TargetModes.Ring,
                ringCondition: (ring) => ring.getFate() === 0,
                gameAction: AbilityDsl.actions.placeFateOnRing()
            },
            limit: sharedLimit
            /*
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring) => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.ring.getFate() === 0,
                    trueGameAction: AbilityDsl.actions.placeFateOnRing(),
                    falseGameAction: AbilityDsl.actions.selectRing((context) => ({
                        activePromptTitle: 'Choose a ring to receive fate',
                        ringCondition: (ring, context) => ring !== context.ring && ring.isUnclaimed(),
                        subActionProperties: (receivingRing) => ({ target: receivingRing, origin: context.ring }),
                        gameAction: AbilityDsl.actions.placeFateOnRing(),
                        message: '{0} moves 1 fate from {1} to {2}',
                        messageArgs: (ring, player) => [player, ring, context.ring]
                    }))
                })
            },
            effectArgs: (context) => [context.ring.getFate() === 0 ? ', placing 1 fate on that ring' : '']
            */
        });

        this.action({
            title: 'Move 1 fate from one ring to another',
            cost: AbilityDsl.costs.bowSelf(),
            targets: {
                donor: {
                    mode: TargetModes.Ring,
                    activePromptTitle: 'Choose a ring to lose fate',
                    ringCondition: (ring) => ring.getFate() > 0
                },
                receiver: {
                    mode: TargetModes.Ring,
                    activePromptTitle: 'Choose a ring to gain fate',
                    ringCondition: (ring, context) => ring !== context.rings.donor,
                    gameAction: AbilityDsl.actions.placeFateOnRing((context) => ({
                        target: context.rings.receiver,
                        origin: context.rings.donor
                    }))
                }
            },
            limit: sharedLimit
        });
    }
}