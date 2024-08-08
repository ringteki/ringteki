import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { ProvinceCard } from '../../../ProvinceCard';

export default class AWarriorsHearth extends DrawCard {
    static id = 'a-warrior-s-hearth';

    setupCardAbilities() {
        this.action({
            title: 'Choose a province',
            condition: (context) => !context.player.getProvinceCardInProvince(context.source.location).isBroken,
            evenDuringDynasty: true,
            target: {
                mode: TargetModes.UpTo,
                numCards: 3,
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: (card, context) =>
                    context.player
                        .getDynastyCardsInProvince(card.location)
                        .some((c: DrawCard) => c.getType() === CardTypes.Holding && c.isFaceup())
            },
            gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: (Array.isArray(context.target) ? context.target : [context.target]).map(
                    (province: ProvinceCard) =>
                        AbilityDsl.actions.moveCard((context) => ({
                            target: context.player.dynastyDeck[0],
                            destination: province.location
                        }))
                )
            })),
            effect: 'put 1 card into each of their non-stronghold provinces.',
            max: AbilityDsl.limit.perRound(1)
        });
    }
}