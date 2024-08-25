import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class CorneringManeuver extends DrawCard {
    static id = 'cornering-maneuver';

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
                        condition: (context) => !context.game.currentConflict.hasMoreParticipants(context.player),
                        trueGameAction: AbilityDsl.actions.selectCard({
                            cardType: CardTypes.Character,
                            controller: Players.Self,
                            gameAction: AbilityDsl.actions.sequential([
                                AbilityDsl.actions.sendHome(),
                                AbilityDsl.actions.moveToConflict()
                            ])
                        }),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ])
            }
        });
    }
}
