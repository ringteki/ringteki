import { Locations, CardTypes, Players } from '../../../Constants';
import type { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BreathOfSuitengu extends DrawCard {
    static id = 'breath-of-suitengu';

    setupCardAbilities() {
        this.action({
            title: 'Ready a shugenja',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.hasTrait('shugenja'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.ready()
            },
            then: {
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    promptTitleForConfirmingAffinity: 'Discard all cards from a province?',
                    gameAction: AbilityDsl.actions.selectCard({
                        targets: true,
                        location: Locations.Provinces,
                        cardType: CardTypes.Province,
                        subActionProperties: (card: ProvinceCard) => ({
                            destination: Locations.DynastyDiscardPile,
                            target: this.#cardsInProvince(card)
                        }),
                        gameAction: AbilityDsl.actions.moveCard({}),
                        message: '{0} discards {1}',
                        messageArgs: (card: ProvinceCard, player, properties) => [player, this.#cardsInProvince(card)]
                    })
                })
            }
        });
    }

    #cardsInProvince(card: ProvinceCard): Array<DrawCard> {
        return card.controller.getDynastyCardsInProvince(card.location);
    }
}
