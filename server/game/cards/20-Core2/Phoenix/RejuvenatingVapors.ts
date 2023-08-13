import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class RejuvenatingVapors extends DrawCard {
    static id = 'rejuvenating-vapors';

    setupCardAbilities() {
        const YES = 'Yes';
        const NO = 'No';

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
                            choices: {
                                [YES]: AbilityDsl.actions.placeFate((context) => ({
                                    origin: context.target.controller
                                })),
                                [NO]: AbilityDsl.actions.noAction()
                            },
                            messages: {
                                [YES]: '{0} chooses to gain place 1 fate from their pool on {1}',
                                [NO]: ''
                            }
                        }),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ]
            }
        });
    }
}
