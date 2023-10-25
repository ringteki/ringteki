import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SagenOfHoneyedWords extends DrawCard {
    static id = 'sagen-of-honeyed-words';

    public setupCardAbilities() {
        this.action({
            title: 'Gain a skill bonus based on your company',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source,
                effect: AbilityDsl.effects.modifyMilitarySkill({ amount: context.target.printedGlory })
            }))
        });
    }
}
