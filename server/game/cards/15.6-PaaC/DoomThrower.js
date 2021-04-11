const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class DoomThrower extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce Province Strength',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'reduce the attacked province\'s strength by {1}',
            effectArgs: context => (context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.getFate() > 0) ? 5 : 2,
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: Locations.Provinces,
                effect: AbilityDsl.effects.modifyProvinceStrength((context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.getFate() > 0) ? -5 : -2)
            }))
        });
    }
}

DoomThrower.id = 'doom-thrower';

module.exports = DoomThrower;
