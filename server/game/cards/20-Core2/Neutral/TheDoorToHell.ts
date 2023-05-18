import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import ConflictPhase = require('../../../gamesteps/conflictphase');
import ProvinceCard = require('../../../provincecard');

export default class TheDoorToHell extends ProvinceCard {
    static id = 'the-door-to-hell';

    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to remove all fate from a character and resolve the conflict',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            cost: AbilityDsl.costs.breakSelf(),
            target: {
                activePromptTitle: 'Choose a character to discard',
                player: Players.Opponent,
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.multipleContext((context) => ({
                    gameActions: [
                        AbilityDsl.actions.removeFate({
                            target: context.target,
                            amount: context.target.getFate()
                        }),
                        AbilityDsl.actions.handler({
                            handler(context) {
                                context.game.continue();
                            }
                        })
                    ]
                }))
            }
        });
    }
}
