import { Locations, CardTypes, CharacterStatus, EventNames } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type BaseCard from '../../../basecard';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

function targetsFromEvent(context: any): WeakSet<BaseCard> {
    switch (context.event.name) {
        case EventNames.OnStatusTokenMoved:
            return new WeakSet([context.event.donor]);
        case EventNames.OnCardDishonored:
            return new WeakSet([context.event.card]);
        case EventNames.OnStatusTokenDiscarded:
            return new WeakSet(context.event.cards);
        default:
            return new WeakSet();
    }
}

function isFriendlyCharacter(context: TriggeredAbilityContext<any>, card: BaseCard) {
    return card.controller === context.player && card.type === CardTypes.Character;
}

export default class DiligentChaperone extends DrawCard {
    static id = 'diligent-chaperone';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            effect: AbilityDsl.effects.cannotParticipateAsAttacker()
        });

        this.reaction({
            title: 'Rehonor the character',
            when: {
                onStatusTokenMoved: (event, context) =>
                    event.token.grantedStatus === CharacterStatus.Honored &&
                    isFriendlyCharacter(context, event.donor) &&
                    !context.source.bowed,
                onCardDishonored: (event: { card: DrawCard }, context) =>
                    event.card.isOrdinary() && isFriendlyCharacter(context, event.card) && !context.source.bowed,
                onStatusTokenDiscarded: (event, context) =>
                    !context.source.bowed &&
                    event.token.grantedStatus === CharacterStatus.Honored &&
                    event.cards.some(isFriendlyCharacter.bind(null, context))
            },
            effect: 'protect the honor of the Crane',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardCondition: (card, context: any) => targetsFromEvent(context).has(card),
                subActionProperties: (card) => {
                    context.target = card;
                    return { target: card };
                },
                gameAction: AbilityDsl.actions.honor(),
                message: '{0} honors {1}',
                messageArgs: (card, player) => [player, card]
            }))
        });
    }
}