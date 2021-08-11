const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Locations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class SecretPlains extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve the ability on a province',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => !card.facedown && !card.isBroken && card.abilities.actions.length > 0,
                gameAction: AbilityDsl.actions.resolveAbility(context => ({
                    target: context.target,
                    ability: context.target.abilities.actions[0],
                    ignoredRequirements: ['province'],
                    choosingPlayerOverride: context.choosingPlayerOverride
                }))
            }
        });

    }
}

SecretPlains.id = 'secret-plains';

module.exports = SecretPlains;
