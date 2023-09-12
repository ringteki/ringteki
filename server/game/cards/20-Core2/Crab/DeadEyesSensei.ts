import { CardTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DeadEyesSensei extends DrawCard {
    static id = 'dead-eyes-sensei';

    public setupCardAbilities() {
        this.action({
            title: 'Ready a character and give them Berserker',
            cost: AbilityDsl.costs.removeFate({
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.bowed || !card.hasTrait('berserker')
            }),
            effect: 'ready {1} and give them Berserker',
            effectArgs: (context) => context.costs.removeFate,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready((context) => ({
                    target: context.costs.removeFate
                })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.costs.removeFate,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.addTrait('creature')
                }))
            ])
        });
    }
}
