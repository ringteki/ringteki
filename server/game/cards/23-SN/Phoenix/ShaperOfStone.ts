import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players, Phases, EventName, Duration } from '../../../Constants.js';
import { EventPayload } from '../../../Events/EventPayloads.js';

export default class ShaperOfStone extends DrawCard {
    static id = 'shaper-of-stone';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            condition: () => true,
            match: (card: DrawCard, context) => !!context && card.type === CardType.Province && card.controller === context.player,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Opponent,
            condition: () => true,
            match: (card: DrawCard, context) => !!context && card.type === CardType.Province && card.controller === context.player.opponent,
            effect: AbilityDsl.effects.modifyProvinceStrength(-1)
        });

        this.reaction({
            title: 'Mark a province',
            when: {
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            },
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onPhaseEnded: (event: EventPayload<EventName.OnPhaseEnded>) => event.phase === Phases.Conflict
                        },
                        message: '{0}{1}{2}',
                        messageArgs: () => context.target.isBroken ? ['', '', ''] : [context.player, ' gains 1 honor due to the delayed effect of ', context.source],
                        gameAction: AbilityDsl.actions.conditional(() => ({
                            condition: () => !context.target.isBroken,
                            trueGameAction: AbilityDsl.actions.gainHonor({
                                target: context.player
                            }),
                            falseGameAction: AbilityDsl.actions.noAction()
                        }))
                    }),
                    duration: Duration.UntilEndOfRound
                })),
            },
            effect: 'mark {1} - they will gain 1 honor if the province remains unbroken at the end of the phase',
            effectArgs: context => context.target?.facedown ? [context.target.location] : [context.target]
        });
    }
}
