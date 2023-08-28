import { CardTypes, Locations, Phases } from '../../../Constants';
import type { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

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
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.moveCard((context) => ({
                    destination: Locations.DynastyDiscardPile,
                    target: this.#cardsInProvince(context.target)
                })),
                AbilityDsl.actions.discardFromPlay((context) => ({
                    target: this.#cardsAttachedToProvince(context.target)
                }))
            ]),
            effect: 'discard {1}',
            effectArgs: (context) => [
                this.#cardsInProvince(context.target).concat(this.#cardsAttachedToProvince(context.target))
            ]
        });
    }

    #cardsInProvince(targetProvince: ProvinceCard) {
        return targetProvince.controller.getDynastyCardsInProvince(targetProvince.location);
    }

    #cardsAttachedToProvince(targetProvince: ProvinceCard) {
        return targetProvince.attachments.toArray();
    }
}
