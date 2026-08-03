import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, EventName, Players } from '../../../Constants.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class TwoFoldVirtue extends DrawCard {
    static id = 'two-folded-virtue';

    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military skill',

            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && (card.hasTrait('bushi') || card.hasTrait('scout')),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2),
                        target: context.target
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event: EventPayload<EventName.AfterConflict>) =>
                                    context.player === event.conflict.loser
                            },
                            gameAction: AbilityDsl.actions.gainHonor(() => ({ target: context.player })),
                            message: '{0} gains 1 honor due to the delayed effect of {1}',
                            messageArgs: [context.player, context.source]
                        })
                    }))
                ])
            },
            effect: 'grant +2{1} to {0} and, if they lose the current conflict, gain 1 honor',
            effectArgs: ['military']
        });
    }
}
