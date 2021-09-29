const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class MiokosSong extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of your next event',
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.dishonor({ cardCondition: card => card.type === CardTypes.Character })
            ],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Event && card.printedCost >= 1)
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.addKeyword('courtesy'),
                    target: context.costs.dishonor,
                    duration: Durations.UntilEndOfRound
                }))
            ]),
            effect: 'reduce the cost of their next event this phase with printed cost 1 or more by 1 and give {1} Courtesy until the end of the round',
            effectArgs: context => [context.costs.dishonor]
        });
    }
}

MiokosSong.id = 'mioko-s-song';

module.exports = MiokosSong;
