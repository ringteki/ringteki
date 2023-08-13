import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SanctifiedEarth extends DrawCard {
    static id = 'sanctified-earth';

    public setupCardAbilities() {
        this.action({
            title: 'Give attached character a skill bonus',
            condition: (context) => context.game.isDuringConflict() && context.source.parent?.isParticipating(),
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                const gameActions = [
                    AbilityDsl.actions.cardLastingEffect({
                        target: context.source.parent,
                        effect: AbilityDsl.effects.modifyBothSkills(2)
                    })
                ];
                if (this.#hasKicker(context.source.parent)) {
                    gameActions.push(
                        AbilityDsl.actions.cardLastingEffect({
                            target: context.source.parent,
                            effect: AbilityDsl.effects.cardCannot({
                                cannot: 'sendHome',
                                restricts: 'opponentsCardEffects'
                            })
                        })
                    );
                }

                return { gameActions };
            }),
            effect: 'give +2{1} and +2{2} to {3}{4}',
            effectArgs: (context) => [
                'military',
                'political',
                context.source.parent,
                this.#hasKicker(context.source.parent) ? ' and protect them from being moved home by the opponent' : ''
            ]
        });
    }

    #hasKicker(character: DrawCard) {
        return character.hasTrait('shugenja') && character.hasTrait('earth');
    }
}
