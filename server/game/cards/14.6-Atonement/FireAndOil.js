const DrawCard = require('../../drawcard.js');
const { CardTypes, AbilityTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FireAndOil extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !context.player.getProvinceCardInProvince(context.source.location).isBroken,
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Dishonor a character',
                condition: context => context.game.isDuringConflict() && context.game.currentConflict
                    && context.game.currentConflict.conflictProvince && context.game.currentConflict.conflictProvince.controller === context.player,
                cost: AbilityDsl.costs.payHonor(1),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isAttacking(),
                    gameAction: AbilityDsl.actions.dishonor()
                }
            })
        });
    }
}

FireAndOil.id = 'fire-and-oil';

module.exports = FireAndOil;
