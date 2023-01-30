const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players } = require('../../../Constants.js');

const captureParentCost = function() {
    return {
        action: { name: 'captureParentCost', getCostMessage: () => '' },
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.costs.captureParentCost = context.source.parent;
        },
        pay: function() {
        }
    };
};


class WhispersOfTheLordsOfDeath extends DrawCard {
    canPlay(context, playType) {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context, playType);
    }

    setupCardAbilities() {
        this.forcedReaction({
            cost: captureParentCost(),
            title: 'Remove a fate and move this to another character',
            when: {
                afterConflict: (event, context) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.loser === context.source.parent.controller
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose a character to receive the Lords of Death',
                    cardType: CardTypes.Character,
                    player: context.source.parent.controller === context.player ? Players.Self : Players.Opponent,
                    cardCondition: (card, context) => card.controller !== context.source.parent.controller,
                    message: '{0} attaches {1} to {2}',
                    messageArgs: card => [context.source.parent.controller, context.source, card],
                    gameAction: AbilityDsl.actions.attach(context => ({ attachment: context.source }))
                })),
                AbilityDsl.actions.removeFate(context => ({ target: context.costs.captureParentCost ? context.costs.captureParentCost : context.source.parent }))
            ]),
            effect: 'remove a fate from {1} and move {2} to another character',
            effectArgs: context => [context.source.parent, context.source]
        });
    }
}
WhispersOfTheLordsOfDeath.id = 'whispers-of-the-lords-of-death';

module.exports = WhispersOfTheLordsOfDeath;
