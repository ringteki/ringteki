const StrongholdCard = require('../../strongholdcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IronMountainCastle extends StrongholdCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isFaction('dragon'),
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyRestrictedAttachmentAmount(1)
        });

        this.interrupt({
            title: 'Reduce cost of next attachment',
            when: {
                onAbilityResolverInitiated: (event, context) => {
                    //might be able to remove the source.type check at some point
                    const isAttachment = (event.context.source.type === CardTypes.Attachment || event.context.ability instanceof PlayAttachmentAction);
                    const tgtIsCharacter = (event.context.target.type === CardTypes.Character);
                    return isAttachment && tgtIsCharacter && event.context.player === context.player &&
                    event.context.target && event.context.target.controller === context.player &&
                    event.context.ability.getReducedCost(event.context) > 0;
                }
            },
            cost: AbilityDsl.costs.bowSelf(),
            effect: 'reduce the cost of their next attachment by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card === context.event.context.source)
            }))
        });
    }
}

IronMountainCastle.id = 'iron-mountain-castle';

module.exports = IronMountainCastle;
