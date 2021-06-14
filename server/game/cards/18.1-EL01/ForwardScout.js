const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

const forwardScoutCaptureParentCost = function() {
    return {
        action: { name: 'forwardScoutCaptureParentCost', getCostMessage: () => '' },
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.costs.forwardScoutCaptureParentCost = context.source.parent;
        },
        pay: function() {
        }
    };
};


class ForwardScout extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Move attached character into the conflict',
            cost: [
                forwardScoutCaptureParentCost(),
                AbilityDsl.costs.sacrificeSelf()
            ],
            condition: context => context.source.parent && !context.source.parent.bowed,
            gameAction: AbilityDsl.actions.moveToConflict(context => ({ target: [context.source.parent, context.costs.forwardScoutCaptureParentCost] }))
        });
    }
}

ForwardScout.id = 'forward-scout';

module.exports = ForwardScout;


