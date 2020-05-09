const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class KitsukiChiari extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Name a card',
            when: {
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.source.controller &&
                    context.source.controller.opponent && context.source.controller.opponent.hand.size() > 0
            },
            cost: [kitsukiChiariCost()],
            gameAction: AbilityDsl.actions.ifAble(() => ({
                ifAbleAction: AbilityDsl.actions.discardMatching(context => ({
                    target: context.player.opponent,
                    cards: context.player.opponent.hand.shuffle().slice(0, 4).sort((a, b) => a.name.localeCompare(b.name)),
                    amount: -1, //all
                    reveal: true,
                    match: (context, card) => card.name === context.costs.kitsukiChiariCost
                })),
                otherwiseAction: AbilityDsl.actions.lookAt(context => ({
                    target: context.player.opponent.hand.shuffle().slice(0, 4)
                }))
            })),
            effect: 'name a card and look at 4 random cards in {1}\'s hand',
            effectArgs: context => [context.player.opponent]
        });
    }

    selectCardName(player, cardName, context) {
        context.costs.kitsukiChiariCost = cardName;
        return true;
    }

    allowAttachment(attachment) {
        if(attachment.hasTrait('poison') && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}

const kitsukiChiariCost = function() {
    return {
        action: { name: 'kitsukiChiariCost', getCostMessage: () => ['naming {0}', []] },
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.game.promptWithMenu(context.player, context.source, {
                context: context,
                activePrompt: {
                    menuTitle: 'Name a card',
                    controls: [
                        { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                    ]
                }
            });
        },
        pay: function (context) {
            context.game.addMessage('{0} names {1}', context.player, context.costs.kitsukiChiariCost);
        }
    };
};

KitsukiChiari.id = 'kitsuki-chiari';
module.exports = KitsukiChiari;

