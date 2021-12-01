const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes } = require('../../../Constants');
const PlayAttachmentAction = require('../../../playattachmentaction.js');
const PlayCharacterAction = require('../../../playcharacteraction.js');

class KhanbulakBenefactorReprint extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onAbilityResolverInitiated: (event, context) => {
                    //might be able to remove the source.type check at some point
                    const isAttachment = (event.context.source.type === CardTypes.Attachment || event.context.ability instanceof PlayAttachmentAction);
                    const isCharacter = (event.context.ability instanceof PlayCharacterAction);
                    return (isAttachment || isCharacter) && context.source.isParticipating() && event.context.player === context.player && event.context.ability.getReducedCost(event.context) > 0;
                },
                onCardPlayed: (event, context) => context.source.isParticipating() && event.player === context.player && event.context.ability.getReducedCost(event.context) > 0
            },
            effect: 'reduce the cost of their next card by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card === context.event.context.source)
            }))
        });

        this.reaction({
            title: 'Draw a card',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

KhanbulakBenefactorReprint.id = 'khanbulak-philanthropist';

module.exports = KhanbulakBenefactorReprint;
