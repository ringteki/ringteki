import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BreathOfSuitengu extends DrawCard {
    static id = 'breath-of-suitengu';

    setupCardAbilities() {
        this.action({
            title: 'Ready a shugenja',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.hasTrait('shugenja'),
                controller: Players.Self,
                gameAction: [
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.conditional({
                        condition: (context) => context.target.hasTrait('water'),
                        trueGameAction: AbilityDsl.actions.chooseAction({
                            activePromptTitle: 'Move 1 fate from your pool to the shugenja?',
                            player: Players.Self,
                            options: {
                                Yes: {
                                    action: AbilityDsl.actions.placeFate((context) => ({
                                        origin: context.target.controller
                                    })),
                                    message: '{0} chooses to gain place 1 fate from their pool on {1}'
                                },
                                No: {
                                    action: AbilityDsl.actions.noAction()
                                }
                            }
                        }),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ]
            }
        });
    }
}
