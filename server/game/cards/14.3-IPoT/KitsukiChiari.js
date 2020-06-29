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
            cost: AbilityDsl.costs.nameCard(),
            gameAction: AbilityDsl.actions.ifAble(() => ({
                ifAbleAction: AbilityDsl.actions.discardMatching(context => ({
                    target: context.player.opponent,
                    cards: context.player.opponent.hand.shuffle().slice(0, 4).sort((a, b) => a.name.localeCompare(b.name)),
                    amount: -1, //all
                    reveal: true,
                    match: (context, card) => card.name === context.costs.nameCardCost
                })),
                otherwiseAction: AbilityDsl.actions.lookAt(context => ({
                    target: context.player.opponent.hand.shuffle().slice(0, 4)
                }))
            })),
            effect: 'look at 4 random cards in {1}\'s hand and discard all cards named {2}',
            effectArgs: context => [context.player.opponent, context.costs.nameCardCost]
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

KitsukiChiari.id = 'kitsuki-chiari';
module.exports = KitsukiChiari;
