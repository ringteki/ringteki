import AbilityDsl from '../../../abilitydsl';
import { AbilityTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityProps } from '../../../Interfaces';

export default class SanctifiedEarth extends DrawCard {
    static id = 'sanctified-earth';

    public setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Give character a skill bonus',
                when: {
                    onConflictDeclared: (event, context) => event.attackers.includes(context.source),
                    onDefendersDeclared: (event, context) => event.defenders.includes(context.source),
                    onMoveToConflict: (event, context) => event.card === context.source
                },
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        effect: AbilityDsl.effects.modifyBothSkills(2)
                    })),

                    AbilityDsl.actions.onAffinity({
                        trait: 'earth',
                        effect: "make {0} invulnerable to opponent's send home",
                        effectArgs: (context) => [context.source],
                        gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.source,
                            effect: AbilityDsl.effects.cardCannot({
                                cannot: 'sendHome',
                                restricts: 'opponentsCardEffects'
                            })
                        }))
                    })
                ]),

                effect: 'give +2{1} and +2{2} to {3}',
                effectArgs: (context) => ['military', 'political', context.source]
            } as TriggeredAbilityProps)
        });
    }
}