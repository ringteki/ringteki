import DrawCard from '../../../DrawCard.js';
import { CardType, Phases, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class AkodoTadakatsu extends DrawCard {
    static id = 'akodo-tadakatsu';

    setupCardAbilities() {
        this.reaction({
            title: 'Injure a character',
            when: {
                onMoveFate: (event, context) => {
                    if(context.game.currentPhase === Phases.Fate || event.origin !== context.source || event.fate <= 0) {
                        return false;
                    }
                    const cause = event.context;
                    return !!cause && !!context.player.opponent && cause.player === context.player.opponent &&
                        ((cause.source.type as string) === 'ring' || cause.ability.isCardAbility());
                }
            },
            target: {
                controller: Players.Opponent,
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.injure()
            }
        });

        this.reaction({
            title: 'Injure or bow a character',
            when: {
                onConflictStarted: (event, context) => context.source.isAttacking()
            },
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    player: Players.Opponent,
                    cardCondition: card => card.isDefending()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Injure this character': AbilityDsl.actions.injure((context: AbilityContext) => ({ target: context.targets.character })),
                        'Bow this character': AbilityDsl.actions.bow((context: AbilityContext) => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}
