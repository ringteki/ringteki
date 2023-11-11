import { CardTypes, Durations, Phases } from '../../../Constants';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';

export default class MiokosSong extends StrongholdCard {
    static id = 'mioko-s-song';

    setupCardAbilities() {
        this.action({
            title: 'Gain a fate',
            phase: Phases.Conflict,
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.dishonor({ cardCondition: (card) => card.type === CardTypes.Character })
            ],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.gainFate((context) => ({
                    target: context.player,
                    amount: 1
                })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.addKeyword('courtesy'),
                    target: context.costs.dishonor,
                    duration: Durations.UntilEndOfRound
                }))
            ]),
            effect: 'gain a fate and give {1} Courtesy until the end of the round',
            effectArgs: (context) => [context.costs.dishonor]
        });
    }
}
