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
                return ['spending 1 fate'];
            }
            return undefined;
        },
        canPay: function () {
            return true;
        },
        resolve: function (context) {
            let ringAvailable = false;
            let fateAvailable = true;
            if(context.game.rings['water'].isConsideredClaimed(context.player)) {
                ringAvailable = true;
            }
            if(context.player.fate < 1) {
                fateAvailable = false;
            }
            if(!context.player.checkRestrictions('spendFate', context)) {
                fateAvailable = false;
            }
            context.costs.oneWithTheSeaCostPaid = false;
            if(ringAvailable && fateAvailable) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Spend 1 fate?',
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

                let fateAction = context.game.actions.loseFate({ target: context.player, amount: 1 });
                events.push(fateAction.getEvent(context.player, context));
                context.game.addMessage('{0} chooses to spend 1 fate', context.player);

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
