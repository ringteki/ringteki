import { CardType, Duration, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { AbilityContext } from '../../../AbilityContext.js';
import Player from '../../../Player.js';

const abilityCost = function (confidanteController: Player) {
    return {
        canPay: function (context: AbilityContext) {
            const canLoseHonor = context.game.actions.loseHonor().canAffect(context.player, context);
            const canGainHonor = context.game.actions.gainHonor().canAffect(confidanteController, context);
            //The controller of the character must give the controller of Confidante 1 honor
            //You cannot force the controller to pay if you are not the controller, and the controller cannot pay themselves
            return canLoseHonor && canGainHonor && context.player === context.source.controller && context.player !== confidanteController;
        },
        resolve: function () {
            return true;
        },
        payEvent: function (context: AbilityContext) {
            const events = [];
            const honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
            events.push(honorAction.getEvent(context.player, context));
            context.game.addMessage('{0} gives {1} 1 honor to trigger {2}\'s ability', context.player, confidanteController, context.source);

            return events;
        },
        promptsPlayer: false
    };
};

export default class BashfulConfidante extends DrawCard {
    static id = 'bashful-confidante';

    setupCardAbilities() {
        this.reaction({
            title: 'Pick a character to spend honor to use abilities',
            when: {
                onConflictStarted: (_, context) => context.source.isParticipating()
            },
            target: {
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    duration: Duration.UntilEndOfConflict,
                    effect: AbilityDsl.effects.additionalTriggerCostForCard(() => [abilityCost(context.player)])
                }))
            },
            effect: 'force {1} to pay 1 honor to {2} in order to trigger {0}\'s abilities',
            effectArgs: context => [context.player.opponent, context.player]
        });
    }
}
