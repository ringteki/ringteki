import { DuelType, Duration } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { LastingEffectProperties } from '../../../GameActions/LastingEffectAction.js';
import { GameAction } from '../../../GameActions/GameAction.js';

export default class IsawaHouseGuard extends DrawCard {
    static id = 'isawa-house-guard';

    public setupCardAbilities() {
        this.duelFocus({
            title: 'Help a character with a duel',
            duelCondition: (duel, context) => duel.participants.includes(context.source) && context.source.isHonored,
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.duel,
                effect: AbilityDsl.effects.modifyDuelSkill({ amount: 1, player: context.player }),
                duration: Duration.UntilEndOfDuel
            } as LastingEffectProperties)),
            effect: 'add 1 to their duel total'
        });

        this.action({
            title: 'Initiate a military duel to dishonor',
            initiateDuel: {
                type: DuelType.Military,
                gameAction: (duel) => AbilityDsl.actions.multipleContext(() => {
                    const gameActions: GameAction[] = [];

                    gameActions.push(AbilityDsl.actions.dishonor({
                        target: duel.loser
                    }));
                    duel.loser?.forEach(card => {
                        if(card.isTainted) {
                            gameActions.push(AbilityDsl.actions.injure({
                                target: card
                            }));
                        }
                    });
                    return { gameActions };
                }),
                message: '{0} is dishonored and injured if tainted',
                messageArgs: duel => [duel.loser]
            }
        });
    }
}
