import { AbilityTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KakitaBlade2 extends DrawCard {
    static id = 'kakita-blade-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Gain a fate',
                when: {
                    onConflictStarted: (event, context) => context.source.isParticipating() && context.source.hasTrait('bushi')
                },
                gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    duration: Durations.UntilPassPriority,
                    effect: context.player.actionPhasePriority ?
                        AbilityDsl.effects.additionalAction() :
                        AbilityDsl.effects.gainActionPhasePriority(),
                })),
                effect: 'take an action at the start of the conflict'
            })
        });
    }
}
