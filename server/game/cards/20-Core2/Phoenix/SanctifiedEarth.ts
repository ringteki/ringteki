import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SanctifiedEarth extends DrawCard {
    static id = 'sanctified-earth';

    public setupCardAbilities() {
        this.action({
            title: 'Give attached character a skill bonus',
            condition: (context) => context.source.parent?.isParticipating() ?? false,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyBothSkills(2)
            })),
            then: {
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.source.parent,
                    effect: AbilityDsl.effects.cardCannot({
                        cannot: 'sendHome',
                        restricts: 'opponentsCardEffects'
                    })
                }))
            },

            effect: 'give +2{1} and +2{2} to {3}',
            effectArgs: (context) => [
                'military',
                'political',
                context.source.parent
                // this.#hasKicker(context.source.parent) ? ' and protect them from being moved home by the opponent' : ''
            ]
        });
    }
}
