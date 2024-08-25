import AbilityDsl from '../../../abilitydsl';
import { AbilityTypes, CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { ActionProps } from '../../../Interfaces';

export default class Kusarigama extends DrawCard {
    static id = 'kusarigama';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Give -2 military to a participating character',
                condition: (context) => context.source.isParticipating('military'),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                        effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                    }))
                },
                effect: "reduce {0}'s military skill by 2"
            } as ActionProps<this>)
        });
    }
}
