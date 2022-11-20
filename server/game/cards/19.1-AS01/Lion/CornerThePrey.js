const DrawCard = require('../../../drawcard.js');
const { ConflictTypes, TargetModes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

const cornerThePreyCost = function () {
    return {
        action: { name: 'cornerThePreyCost' },
        getActionName(_) { // eslint-disable-line no-unused-vars
            return 'cornerThePreyCost';
        },
        getCostMessage: function (_) { // eslint-disable-line no-unused-vars
            return ['sacrificing {0}'];
        },
        canPay: function (context) { //cant get the attachments weird wrapped shit
            const attachments = context.player.cardsInPlay.reduce((array, card) => array.concat(card.attachments.toArray()), []);
            const canPayCost = attachments.some(attachment => attachment.traits.some(trait => trait === 'follower'));
            return canPayCost;
        },
        resolve: function (context, result) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose followers to sacrifice',
                context: context,
                mode: TargetModes.Select,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('follower') && card.parent.isParticpating(),
                onSelect: (_, card) => {
                    if(!context.costs.cornerThePreyCost) {
                        context.costs.cornerThePreyCost = [card];
                    }
                    context.costs.cornerThePreyCost.push(card);
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent: function (context) {
            let action = context.game.actions.sacrifice({ target: context.costs.cornerThePreyCost });
            return action.getEvent(context.costs.cornerThePreyCost, context);
        },
        promptsPlayer: true
    };
};

class CornerThePrey extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice followers to kill',
            cost: cornerThePreyCost(),
            cannotTargetFirst: true,
            condition: context => context.game.isDuringConflict(ConflictTypes.Military),
            gameAction: AbilityDsl.actions.selectCard(() => ({
                cardCondition: (card, context) => {
                    console.log('cost: ', context.costs.cornerThePreyCost);
                    return card.isParticipating() && context.costs.cornerThePreyCost && card.printedCost <= context.costs.cornerThePreyCost.length;
                },
                activePromptTitle: 'Choose a card to discard',
                gameAction: AbilityDsl.actions.discardFromPlay()
            }))
        });
    }
}

CornerThePrey.id = 'corner-the-prey';

module.exports = CornerThePrey;
