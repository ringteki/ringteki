import AbilityDsl from '../../../abilitydsl';
import { AbilityTypes, CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { ActionProps } from '../../../Interfaces';

export default class TruthBurnsThroughLies extends DrawCard {
    static id = 'truth-burns-through-lies';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Dishonor a character',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() &&
                        (context.source.hasTrait('magistrate') || card.printedCost < context.source.printedCost),
                    gameAction: AbilityDsl.actions.dishonor()
                }
            } as ActionProps<this>)
        });
    }
}
