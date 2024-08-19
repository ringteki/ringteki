import AbilityDsl from '../../../abilitydsl';
import { Conflict } from '../../../conflict';
import { CardTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class PurityOfPurpose extends DrawCard {
    static id = 'purity-of-purpose';

    setupCardAbilities() {
        this.action({
            title: 'Give +2 military to a character',
            condition: (context) => context.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    }),
                    AbilityDsl.actions.conditional({
                        condition: (context) => {
                            const conflict = context.game.currentConflict as Conflict;
                            return conflict.defendingPlayer === context.player
                                ? conflict.attackerSkill > conflict.defenderSkill
                                : conflict.defenderSkill > conflict.attackerSkill;
                        },
                        trueGameAction: AbilityDsl.actions.honor(),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ])
            }
        });
    }
}