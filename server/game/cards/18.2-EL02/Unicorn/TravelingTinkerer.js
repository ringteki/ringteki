const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class TravelingTinkerer extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice an attachment to gain fate',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent
            }),
            effect: 'gain 1 fate{1}',
            effectArgs: context => [context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.parent && context.costs.sacrificeStateWhenChosen.parent.hasTrait('merchant') ? ' and 1 honor' : ''],
            gameAction: AbilityDsl.actions.multipleContext(context => {
                let merchant = context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.parent && context.costs.sacrificeStateWhenChosen.parent.hasTrait('merchant');
                let actions = [AbilityDsl.actions.gainFate({ target: context.player, amount: 1 })];
                if(merchant) {
                    actions.push(AbilityDsl.actions.gainHonor({ target: context.player, amount: 1 }));
                }
                return ({
                    gameActions: actions
                });
            })
        });
    }
}

TravelingTinkerer.id = 'traveling-tinkerer';

module.exports = TravelingTinkerer;
