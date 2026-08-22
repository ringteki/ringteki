import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Duration, EventName, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
export default class MapmakerApprentice extends DrawCard {
    static id = 'mapmaker-apprentice';

    setupCardAbilities() {
        this.action({
            title: 'Map a province',
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, eventContext: AbilityContext) => {
                                if (!eventContext.game.currentConflict) {
                                    return false;
                                }
                                if (!(context.target as ProvinceCard).isConflictProvince()) {
                                    return false;
                                }
                                if (event.player !== context.player || event.card.type !== CardType.Event) {
                                    return false;
                                }
                                const eventsPlayed = eventContext.game.currentConflict.getCardsPlayed(context.player, (card) => card.type === CardType.Event).length;
                                return eventsPlayed <= 1
                            }
                        },
                        effect: '{0} changes the province strength of an attacked province',
                        messageArgs: () => [context.player],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.selectCard((context) => ({
                            activePromptTitle: 'Choose an attacked province',
                            hidePromptIfSingleCard: true,
                            cardType: CardType.Province,
                            location: Location.Provinces,
                            cardCondition: (card) => card.isConflictProvince(),
                            subActionProperties: (card) => {
                                context.target = card;
                                return { target: card };
                            },
                            gameAction: AbilityDsl.actions.chooseAction(() => ({
                                messages: {},
                                options: {
                                    'Raise attacked province\'s strength by 2': {
                                        action: AbilityDsl.actions.cardLastingEffect(() => ({
                                            targetLocation: Location.Provinces,
                                            effect: AbilityDsl.effects.modifyProvinceStrength(2)
                                        })),
                                        message: '{0} chooses to increase {1}\'s strength by 2'
                                    },
                                    'Lower attacked province\'s strength by 2': {
                                        action: AbilityDsl.actions.cardLastingEffect((context) => ({
                                            targetLocation: Location.Provinces,
                                            effect:
                                                context.target.getStrength() > 1
                                                    ? AbilityDsl.effects.modifyProvinceStrength(-2)
                                                    : []
                                        })),
                                        message: '{0} chooses to reduce {1}\'s strength by 2'
                                    }
                                }
                            }))
                        }))
                    }),
                    duration: Duration.UntilEndOfRound
                })),
            },
            effect: 'map {0} - the first event they play during each conflict at that province will also modify its strength',
        });
    }
}
