const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class AkodoCho extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent === context.source && card.hasTrait('follower')
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.selectCard(context => ({
                        cardType: CardTypes.Attachment,
                        effect: 'discard an attachment on {0}',
                        effectArgs: context => [context.target],
                        activePromptTitle: 'Choose an attachment to discard',
                        cardCondition: card => card.parent === context.target,
                        message: '{0} discards {1}',
                        messageArgs: card => [context.player, card],
                        gameAction: AbilityDsl.actions.discardFromPlay()
                    })),
                    otherwiseAction: AbilityDsl.actions.bow({ target: context.target })
                }))
            },
            cannotTargetFirst: true
        });
    }
}

AkodoCho.id = 'akodo-cho';

module.exports = AkodoCho;
