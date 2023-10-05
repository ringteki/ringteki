import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShosuroHiroyuki extends DrawCard {
    static id = 'shosuro-hiroyuki';

    setupCardAbilities() {
        this.action({
            title: 'Force opponent to discard card or dishonor a character',
            condition: (context) =>
                context.game.isDuringConflict('political') && (context.source as DrawCard).isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card: DrawCard, context) =>
                    card.isParticipating() && card.politicalSkill < (context.source as DrawCard).politicalSkill,
                gameAction: AbilityDsl.actions.conditional((context) => ({
                    condition: (context) => (context.target as DrawCard).isDishonored,
                    trueGameAction: AbilityDsl.actions.discardAtRandom({
                        amount: 1,
                        target: (context.target as DrawCard).controller
                    }),
                    falseGameAction: AbilityDsl.actions.dishonor({ target: context.target })
                }))
            }
        });
    }
}
