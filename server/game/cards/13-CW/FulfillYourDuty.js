const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FulfillYourDuty extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'add {1} to the attacked province\'s strength',
            effectArgs: context => context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.getMilitarySkill() : 0,
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: Locations.Provinces,
                effect: AbilityDsl.effects.modifyProvinceStrength(context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.getMilitarySkill() : 0)
            }))
        });
    }
}

FulfillYourDuty.id = 'fulfill-your-duty';

module.exports = FulfillYourDuty;
