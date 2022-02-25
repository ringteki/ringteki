const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Durations, Players } = require('../../../Constants');

const graspOfLandCost = function () {
    return {
        action: { name: 'graspOfLandCost' },
        getActionName(context) { // eslint-disable-line no-unused-vars
            return 'graspOfLandCost';
        },
        getCostMessage: function (context) { // eslint-disable-line no-unused-vars
            if(context.source.parent && context.source.parent.hasTrait('shugenja')) {
                return undefined;
            }
            return ['spending 1 fate'];
        },
        canPay: function (context) {
            return (context.source.parent && context.source.parent.hasTrait('shugenja')) ||
                context.game.actions.loseFate().canAffect(context.player, context);
        },
        resolve: function (context) {
            context.costs.graspOfLandCost = context.player;
            context.costs.skipGraspOfLandCost = context.source.parent && context.source.parent.hasTrait('shugenja');
        },
        payEvent: function (context) {
            if(!context.costs.skipGraspOfLandCost) {
                let events = [];

                let fateAction = context.game.actions.loseFate({ target: context.player });
                events.push(fateAction.getEvent(context.player, context));
                return events;
            }

            let action = context.game.actions.handler(); //this is a do-nothing event to allow you to "pay" a non-payment cost
            return action.getEvent(context.player, context);

        }
    };
};

class GraspOfLand extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent characters from entering play',
            effect: 'prevent characters from entering play this conflict',
            cost: graspOfLandCost(),
            when: {
                onConflictDeclaredBeforeProvinceReveal: () => true
            },
            max: AbilityDsl.limit.perRound(1),
            gameAction: AbilityDsl.actions.conflictLastingEffect(() => ({
                duration: Durations.UntilEndOfConflict,
                targetController: Players.Any,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: 'enterPlay',
                    restricts: 'characters'
                })
            }))
        });
    }
}

GraspOfLand.id = 'grasp-of-land';

module.exports = GraspOfLand;
