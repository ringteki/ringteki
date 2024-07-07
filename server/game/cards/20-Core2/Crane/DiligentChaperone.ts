import { Locations, CardTypes, CharacterStatus, EventNames } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

function targetFromEvent(context: any): undefined | DrawCard {
    switch (context.event.name) {
        case EventNames.OnStatusTokenMoved:
            return context.event.donor;
        case EventNames.OnCardDishonored:
            return context.event.card;
    }
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
                    event.donor.controller === context.player &&
                    event.donor.type === CardTypes.Character &&
                    !context.source.bowed,
                onCardDishonored: (event: { card: DrawCard }, context) =>
                    event.card.isOrdinary() &&
                    event.card.controller === context.player &&
                    event.card.type === CardTypes.Character &&
                    !context.source.bowed
            },
            effect: 'protect the honor of the Crane',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardCondition: (card, context: any) => targetFromEvent(context) === card,
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