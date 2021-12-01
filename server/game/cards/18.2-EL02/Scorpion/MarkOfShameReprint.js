const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class MarkOfShameReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor attached character',
            cost: AbilityDsl.costs.payFate(1),
            gameAction: AbilityDsl.actions.dishonor(context => ({ target: context.source.parent }))
        });
    }
}

MarkOfShameReprint.id = 'venomous-reputation';

module.exports = MarkOfShameReprint;
