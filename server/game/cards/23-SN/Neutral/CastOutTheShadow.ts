import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { Players, TargetMode, CardType } from '../../../Constants.js';

export default class CastOutTheShadow extends DrawCard {
    static id = 'cast-out-the-shadow';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor or bow a character',
            condition: context => context.game.isDuringConflict(),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating() && (card.isTainted || card.hasSomeTrait('corrupt', 'shadowlands'))
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Sacrifice this character': AbilityDsl.actions.sacrifice((context: AbilityContext) => ({ target: context.targets.character })),
                        'Give opponent 2 honor': AbilityDsl.actions.takeHonor((context: AbilityContext) => ({ target: context.player.opponent, amount: 2 }))
                    }
                }
            }
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.isCharacterTraitInPlay('shugenja')) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}
