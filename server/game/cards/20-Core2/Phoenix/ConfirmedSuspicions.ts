import { CardTypes, ConflictTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ConfirmedSuspicions extends DrawCard {
    static id = 'confirmed-suspicions';

    setupCardAbilities() {
        this.action({
            title: 'Ready a shugenja',
            condition: (context) => context.game.isDuringConflict(ConflictTypes.Political),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.taint()
            },
            then: {
                condition: (context) =>
                    context.player.anyCardsInPlay(
                        (card: DrawCard) =>
                            card.isParticipating() && card.hasTrait('shugenja') && card.hasTrait('earth')
                    ),
                gameAction: AbilityDsl.actions.chooseAction({
                    activePromptTitle: 'Bow that character?',
                    player: Players.Self,
                    options: {
                        Yes: {
                            action: AbilityDsl.actions.bow((context) => ({ target: context.target })),
                            message: '{0} chooses to bow {1}'
                        },
                        No: {
                            action: AbilityDsl.actions.noAction()
                        }
                    }
                })
            }
        });
    }
}
