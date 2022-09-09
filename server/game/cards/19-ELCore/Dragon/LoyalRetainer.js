const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class LoyalRetainer extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'negate attachment being targeted',
            cost: AbilityDsl.costs.discardSelf(),
            when: {
                onInitiateAbilityEffects: (event, context) => true
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

LoyalRetainer.id = 'loyal-retainer';

module.exports = LoyalRetainer;
