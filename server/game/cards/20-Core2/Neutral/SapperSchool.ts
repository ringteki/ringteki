import { CardTypes, Locations, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type ProvinceCard from '../../../provincecard';

export default class SapperSchool extends DrawCard {
    static id = 'sapper-school';

    setupCardAbilities() {
        this.action({
            title: 'Discard all cards in and attached to a province ',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province
            },
            gameAction: AbilityDsl.actions.moveCard((context) => ({
                destination: Locations.DynastyDiscardPile,
                target: this.#cardsToDiscard(context.target)
            })),
            effect: 'discard {1}',
            effectArgs: (context) => [this.#cardsToDiscard(context.target)]
        });
    }

    #cardsToDiscard(targetProvince: ProvinceCard) {
        return targetProvince.controller
            .getDynastyCardsInProvince(targetProvince.location)
            .concat(targetProvince.attachments.toArray());
    }
}
