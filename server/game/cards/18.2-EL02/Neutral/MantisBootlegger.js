const DrawCard = require('../../../drawcard.js');
const PlayAttachmentAction = require('../../../playattachmentaction.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');


class MantisBootlegger extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Reduce cost of next attachment',
            when: {
                onAbilityResolverInitiated: (event, context) => {
                    //might be able to remove the source.type check at some point
                    const isAttachment = (event.context.source.type === CardTypes.Attachment || event.context.ability instanceof PlayAttachmentAction);
                    return isAttachment && event.context.player === context.player &&
                    event.context.target && event.context.target.attachments.size() === 0 && event.context.target.type === CardTypes.Character &&
                    event.context.ability.getReducedCost(event.context) > 0;
                }
            },
            limit: AbilityDsl.limit.perRound(2),
            cost: AbilityDsl.costs.payHonor(1),
            effect: 'reduce the cost of their next attachment by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card === context.event.context.source)
            }))
        });
    }
}

MantisBootlegger.id = 'mantis-bootlegger';
module.exports = MantisBootlegger;
