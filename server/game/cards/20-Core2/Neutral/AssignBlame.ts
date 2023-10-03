import { CardTypes, CharacterStatus, Players, TargetModes } from '../../../Constants';
import type { StatusToken } from '../../../StatusToken';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const TOKEN = 'token';
const RECIPIENT = 'recipient';

export default class AssignBlame extends DrawCard {
    static id = 'assign-blame';

    setupCardAbilities() {
        this.action({
            title: 'Move a status token',
            targets: {
                [TOKEN]: {
                    activePromptTitle: 'Choose the status token to move',
                    mode: TargetModes.Token,
                    cardType: CardTypes.Character,
                    tokenCondition: (token: StatusToken) => token.grantedStatus === CharacterStatus.Dishonored
                },
                [RECIPIENT]: {
                    activePromptTitle: 'Choose a Character to receive the token',
                    dependsOn: TOKEN,
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card) => card.isOrdinary(),
                    gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                        gameActions: [
                            AbilityDsl.actions.moveStatusToken({
                                target: context.targets[TOKEN],
                                recipient: context.targets[RECIPIENT]
                            }),
                            AbilityDsl.actions.conditional({
                                condition: (context) =>
                                    context.targets[RECIPIENT].controller !== context.source.controller,
                                trueGameAction: AbilityDsl.actions.draw((context) => ({
                                    amount: 1,
                                    target: context.targets[RECIPIENT].controller
                                })),
                                falseGameAction: AbilityDsl.actions.noAction()
                            })
                        ]
                    }))
                }
            },
            effect: 'move a status token to {1}',
            effectArgs: (context) => [context.targets[RECIPIENT]]
        });
    }

    canPlay(context, playType) {
        if (context.player.anyCardsInPlay((card: DrawCard) => card.hasTrait('courtier'))) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}
