import { CardType, EventName, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class DeedsNotWords extends DrawCard {
    static id = 'deeds-not-words';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +2 mil',

            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, _context) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(_context => ({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event: EventPayload<EventName.AfterConflict>) =>
                                    context.player === event.conflict.winner
                            },
                            gameAction: AbilityDsl.actions.claimImperialFavor(() => ({ target: context.player })),
                            message: '{0} claims the Imperial Favor to the delayed effect of {1}',
                            messageArgs: [context.player, context.source]
                        })
                    }))
                ])
            },
            then: context => ({
                thenCondition: () => !!context && context.player.imperialFavor !== '',
                target: {
                    mode: TargetMode.Select,
                    choices: {
                        'Discard the Imperial Favor': AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseImperialFavor(() => ({
                                target: context?.player
                            })),
                            AbilityDsl.actions.honor(() => ({
                                target: context?.target
                            }))
                        ]),
                        'Done': () => true
                    }
                }
            }),
            effect: 'give {0} +2{1}',
            effectArgs: _context => ['military']
        });
    }
}
