const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class BriskEconomy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch this attachment with another',
            condition: context => context.source.parent,
            cost: AbilityDsl.costs.optionalGiveFateCost(1),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card !== context.source,
                controller: context => (context.costs.optionalFateCost > 0 || context.source.parent.hasTrait('merchant')) ? Players.Any : Players.Self
            },
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.source.parent,
                        attachment: context.target,
                        takeControl: context.target.controller !== context.player
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                })),
                AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.target.parent,
                        attachment: context.source,
                        giveControl: context.target.controller !== context.player
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.source })
                }))
            ]),
            cannotTargetFirst: true,
            effect: '{1}switch it with {2}',
            effectArgs: context => [context.costs.optionalFateCost > 0 ? 'give a fate to their opponent and ' : '', context.target]
        });
    }
}

BriskEconomy.id = 'brisk-economy';

module.exports = BriskEconomy;
