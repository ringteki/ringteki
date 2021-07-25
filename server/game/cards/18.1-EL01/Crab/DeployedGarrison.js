const DrawCard = require('../../../drawcard.js');
const { Locations, Phases, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class DeployedGarrison extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice a holding to play this character',
            location: Locations.Provinces,
            phase: Phases.Dynasty,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Holding
            }),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.reduceNextPlayedCardCost(3)
                })),
                AbilityDsl.actions.playCard(context => ({
                    target: context.source,
                    source: this
                }))
            ]),
            effect: 'play {0}'
        });
    }
}

DeployedGarrison.id = 'deployed-garrison';

module.exports = DeployedGarrison;
