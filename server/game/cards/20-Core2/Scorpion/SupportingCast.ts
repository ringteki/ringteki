import { CardTypes, ConflictTypes, Durations, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SupportingCast extends DrawCard {
    static id = 'supporting-cast';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character to give another +3 military',
            condition: context => context.game.isDuringConflict(ConflictTypes.Military),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                controller: Players.Self
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.costs.bow,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.modifyMilitarySkill(3)
                })
            }
        });
    }
}
