const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players } = require('../../../Constants.js');

const oneWithTheSeaCost = function () {
    return {
        action: { name: 'oneWithTheSeaCost' },
        getActionName(context) { // eslint-disable-line no-unused-vars
            return 'oneWithTheSeaCost';
        },
        getCostMessage: function (context) { // eslint-disable-line no-unused-vars
            if(context.oneWithTheSeaCostPaid) {
                return ['returning the Water Ring'];
            }
            return undefined;
        },
        canPay: function () {
            return true;
        },
        resolve: function (context) {
            let ringAvailable = false;
            if(context.game.rings['water'].claimedBy === context.player.name) {
                ringAvailable = true;
            }

            context.costs.oneWithTheSeaCostPaid = false;
            if(ringAvailable) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Return the water ring?',
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => context.costs.oneWithTheSeaCostPaid = true,
                        () => context.costs.oneWithTheSeaCostPaid = false
                    ]
                });
            }
        },
        payEvent: function (context) {
            if(context.costs.oneWithTheSeaCostPaid) {
                let events = [];

                let returnRingAction = context.game.actions.returnRing({ target: context.game.rings['water'] });
                events.push(returnRingAction.getEvent(context.game.rings['water'], context));
                context.game.addMessage('{0} chooses to return the water ring', context.player);

                return events;
            }

            let action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
            return action.getEvent(context.player, context);

        },
        promptsPlayer: true
    };
};


class OneWithTheSea extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            cost: oneWithTheSeaCost(),
            condition: context => context.game.isDuringConflict(),
            cannotTargetFirst: true,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => context.costs.oneWithTheSeaCostPaid ? true : card.controller === context.player,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

OneWithTheSea.id = 'one-with-the-sea';
module.exports = OneWithTheSea;
