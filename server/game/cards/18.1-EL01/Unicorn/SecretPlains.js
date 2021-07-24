const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class SecretPlains extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve the ability on a province',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.abilities.actions.length > 0,
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
