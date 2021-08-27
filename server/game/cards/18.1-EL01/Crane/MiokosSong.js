const StrongholdCard = require('../../../strongholdcard.js');
const { Phases, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class MiokosSong extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain fate',
            phase: Phases.Conflict,
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.dishonor({ cardCondition: card => card.type === CardTypes.Character })
            ],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.gainFate(context => ({
                    target: context.player,
                    amount: 1
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.addKeyword('courtesy'),
                    target: context.costs.dishonor,
                    duration: Durations.UntilEndOfRound
                }))
            ]),
            effect: 'gain a fate and give {1} Courtesy until the end of the round',
            effectArgs: context => [context.costs.dishonor]
        });
    }
}

MiokosSong.id = 'mioko-s-song';

module.exports = MiokosSong;
