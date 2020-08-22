const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class CommandByName extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce province strength',
            cost: [
                AbilityDsl.costs.payHonor(1),
                AbilityDsl.costs.discardCard({ location: Locations.Hand })
            ],
            condition: (context) => context.game.isDuringConflict() && context.game.currentConflict.conflictProvince,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict.conflictProvince,
                targetLocation: Locations.Provinces,
                effect: AbilityDsl.effects.setBaseProvinceStrength(0)
            })),
            effect: 'reduce the strength of {1} to 0',
            effectArgs: context => [context.game.currentConflict.conflictProvince]
        });
    }
}

CommandByName.id = 'command-by-name';

module.exports = CommandByName;
