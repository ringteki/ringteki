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
                cardCondition: (card) => card.bowed || !card.hasTrait('berserker')
            }),
            handler: (context) =>
                AbilityDsl.actions
                    .multiple([
                        AbilityDsl.actions.ready(),
                        AbilityDsl.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.addTrait('berserker')
                        })
                    ])
                    .resolve(context.costs.removeFate, context),
            effect: 'ready {1} and give them Berserker',
            effectArgs: (context) => context.costs.removeFate
        });
    }
}
