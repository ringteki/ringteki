const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class OpenFieldSkirmisher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce Province Strength',
            condition: context => context.source.isAttacking(),
            effect: 'reduce the strength of {1} by 3',
            cost: AbilityDsl.costs.removeFateFromSelf(),
            effectArgs: context => context.game.currentConflict.conflictProvince,
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.conflictProvince,
                targetLocation: Locations.Provinces,
                effect: AbilityDsl.effects.modifyProvinceStrength(-3)
            }))
        });
    }
}

OpenFieldSkirmisher.id = 'open-field-skirmisher';

module.exports = OpenFieldSkirmisher;
