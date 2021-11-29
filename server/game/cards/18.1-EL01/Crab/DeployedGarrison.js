const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class DeployedGarrison extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice a holding to put this character into play',
            condition: context => context.game.isDuringConflict(),
            location: Locations.DynastyDiscardPile,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Holding
            }),
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.putIntoConflict(context => ({
                    target: context.source
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    duration: Durations.UntilEndOfPhase,
                    location: [Locations.PlayArea],
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: '{0} is removed from the game due to its effect',
                        messageArgs: [context.source],
                        gameAction: AbilityDsl.actions.removeFromGame()
                    })
                }))
            ]),
            effect: 'put {1} into play in the conflict',
            effectArgs: context => [context.source]
        });
    }
}

DeployedGarrison.id = 'deployed-garrison';

module.exports = DeployedGarrison;
