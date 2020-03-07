const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class CountrysideTrader extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve the attacked province ability',
            cost: AbilityDsl.costs.payFate(1),
            condition: context => context.game.isDuringConflict() && context.source.isAttacking(),
            gameAction: AbilityDsl.actions.resolveAbility(context => {
                const conflictProvince = context.game.currentConflict.conflictProvince;
                return {
                    target: conflictProvince,
                    ability: conflictProvince.abilities.actions.concat(conflictProvince.abilities.reactions)[0],
                    ignoredRequirements: ['condition']
                };
            }),
            effect: 'resolve the province ability of {1}',
            effectArgs: context => [context.game.currentConflict.conflictProvince]
        });
    }
}

CountrysideTrader.id = 'countryside-trader';

module.exports = CountrysideTrader;
