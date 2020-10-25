const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class MantraOfVoid extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reduce the cost to attach to a monk by 1',
            when: {
                onConflictDeclared: (event, context) => event.ring.hasElement('void') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.reduceCost({
                        amount: 1,
                        cardType: CardTypes.Attachment,
                        targetCondition: target => target === context.target
                    })
                }))
            },
            effect: 'reduce the cost of attachments they play on {0} this conflict by 1 and draw a card',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

MantraOfVoid.id = 'mantra-of-void';

module.exports = MantraOfVoid;
