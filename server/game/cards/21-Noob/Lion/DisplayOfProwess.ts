import AbilityDsl from '../../../abilitydsl';
import BaseCard from '../../../basecard';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class DisplayOfProwess extends DrawCard {
    static id = 'display-of-prowess';

    setupCardAbilities() {
        this.action({
            title: "Reduce opponent's characters skill",
            condition: (context) => context.player.anyCardsInPlay((card: BaseCard) => card.isParticipating()),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict.getCharacters(context.player.opponent),
                effect: AbilityDsl.effects.modifyBothSkills(-1)
            })),
            then: () => ({
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) =>
                        context.player.anyCardsInPlay(
                            (card: BaseCard) => card.type === CardTypes.Character && card.hasTrait('storyteller')
                        ),
                    trueGameAction: AbilityDsl.actions.gainHonor(),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            }),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
