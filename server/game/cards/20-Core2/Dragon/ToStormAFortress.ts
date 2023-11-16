import { CardTypes, Players, ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ToStormAFortress extends DrawCard {
    static id = 'to-storm-a-fortress';

    public setupCardAbilities() {
        this.action({
            title: "Increase a character's military skill",
            condition: (context) => context.game.isDuringConflict(ConflictTypes.Military),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasSomeTrait('bushi', 'monk'),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'grant +2{1} to {0}',
            effectArgs: ['military']
        });
    }
}
