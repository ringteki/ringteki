import { CardTypes, Locations } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');
import PlayAttachmentAction = require('../../../playattachmentaction');

export default class EarnestSculptor extends DrawCard {
    static id = 'earnest-sculptor';

    public setupCardAbilities() {
        this.action({
            title: 'Search top 8 card for a spell',
            effect: 'look at the top 8 cards of their deck',
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
            effectArgs: (context: TriggeredAbilityContext) => [context.event.context.source],
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: BaseCard) => card === context.event.card || card === context.event.context.source
                )
            }))
        });
    }
}