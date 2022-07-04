const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Durations, Players } = require('../../../Constants');

const theMaidensIcyGraspCost = function () {
    return {
        action: { name: 'theMaidensIcyGraspCost' },
        getActionName(context) { // eslint-disable-line no-unused-vars
            return 'theMaidensIcyGraspCost';
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
            context.costs.theMaidensIcyGraspCost = context.player;
            context.costs.skipTheMaidensIcyGraspCost = context.source.parent && context.source.parent.hasTrait('shugenja');
        },
        payEvent: function (context) {
            if(!context.costs.skipTheMaidensIcyGraspCost) {
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

class TheMaidensIcyGrasp extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent characters from entering play',
            effect: 'prevent characters from entering play this conflict',
            cost: [AbilityDsl.costs.bowSelf(), theMaidensIcyGraspCost()],
            when: {
                onConflictDeclared: (event, context) => context.source.parent && event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => context.source.parent && event.defenders.includes(context.source.parent),
                onMoveToConflict: (event, context) => context.source.parent && event.card === context.source.parent
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

TheMaidensIcyGrasp.id = 'the-maiden-s-icy-grasp';

module.exports = TheMaidensIcyGrasp;
