const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const PlayAttachmentAction = require('../../../playattachmentaction.js');

class EarnestSculptor extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search top 5 card for a spell',
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 8,
                cardCondition: (card) => card.hasTrait('spell'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });

        this.interrupt({
            title: 'Reduce cost of next Jade card',
            when: {
                onCardPlayed: (event, context) =>
                    // Event
                    event.card.type === CardTypes.Event &&
                    // by player
                    event.player === context.player &&
                    // jade
                    event.card.hasTrait('jade') &&
                    // costing more than zero
                    event.context.ability.getReducedCost(event.context) > 0,
                onAbilityResolverInitiated: (event, context) =>
                    // Attachment
                    (event.context.source.type === CardTypes.Attachment ||
                        event.context.ability instanceof PlayAttachmentAction) &&
                    // by player
                    event.context.player === context.player &&
                    // jade
                    event.context.source.hasTrait('jade') &&
                    // costing more than zero
                    event.context.ability.getReducedCost(event.context) > 0
            },
            effect: 'reduce the cost of {1} by 1',
            effectArgs: (context) => [context.event.context.source],
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card) => card === context.event.card || card === context.event.context.source
                )
            }))
        });
    }
}

EarnestSculptor.id = 'earnest-sculptor';

module.exports = EarnestSculptor;
