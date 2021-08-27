const { CardTypes, Players, Elements, TargetModes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const ProvinceCard = require('../../../provincecard.js');

const elementKey = 'maelstrom-water';

const maelstromCost = function () {
    return {
        action: { name: 'maelstromCost' },
        getActionName(context) { // eslint-disable-line no-unused-vars
            return 'maelstromCost';
        },
        getCostMessage: function (context) { // eslint-disable-line no-unused-vars
            if(context.costs.maelstromCostPaid) {
                return ['discarding {0}'];
            }
            return undefined;
        },
        canPay: function () {
            return true;
        },
        resolve: function (context, result) {
            let cardAvailable = true;
            if(!context.game.actions.chosenDiscard().canAffect(context.player, context)) {
                cardAvailable = false;
            }

            context.costs.maelstromCostPaid = false;
            if(cardAvailable) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Discard a card?',
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => {
                            context.costs.maelstromCostPaid = true;
                            context.game.promptForSelect(context.player, {
                                activePromptTitle: 'Choose a card to discard',
                                context: context,
                                mode: TargetModes.Single,
                                numCards: 1,
                                location: Locations.Hand,
                                controller: Players.Self,
                                onSelect: (player, card) => {
                                    context.costs.maelstromCost = card;
                                    return true;
                                },
                                onCancel: () => {
                                    result.cancelled = true;
                                    return true;
                                }
                            });
                        },
                        () => context.costs.maelstromCostPaid = false
                    ]
                });
            }
        },
        payEvent: function (context) {
            if(context.costs.maelstromCostPaid) {
                let events = [];

                let discardAction = context.game.actions.discardCard({ target: context.costs.maelstromCost });
                events.push(discardAction.getEvent(context.costs.maelstromCost, context));
                context.game.addMessage('{0} chooses to discard a card', context.player);

                return events;
            }

            let action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
            return action.getEvent(context.player, context);
        },
        promptsPlayer: true
    };
};

class Maelstrom extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            cost: maelstromCost(),
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol(elementKey)),
            cannotTargetFirst: true,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => context.costs.maelstromCostPaid ? true : card.controller === context.player,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Elements.Water
        });
        return symbols;
    }
}

Maelstrom.id = 'maelstrom';

module.exports = Maelstrom;
