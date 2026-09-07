import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType, TargetMode } from '../../../Constants.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class MotoZealot extends DrawCard {
    static id = 'moto-zealot';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Pressure a character',
            condition: context => context.source.isAttacking() && !!context.game.currentConflict && !!context.player.opponent && !context.game.currentConflict.hasMoreParticipants(context.player.opponent, () => true),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Injure this character': AbilityDsl.actions.injure((context: AbilityContext) => ({ target: context.targets.character })),
                        'Place 1 fate on opponent\'s character': AbilityDsl.actions.placeFate((context: AbilityContext) => ({ target: context.source }))
                    }
                }
            }
        });
    }
}
