import DrawCard from '../../../DrawCard.js';
import { CardType, Location, Players, Stage } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ACleansingDeath extends DrawCard {
    static id = 'a-cleansing-death';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const cardsInProvinces = [
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceOne),
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceTwo),
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceThree),
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceFour),
                        ...context.player.getDynastyCardsInProvince(Location.StrongholdProvince)
                    ];

                    const contextCopy = context.createCopy({
                        stage: Stage.Target
                    });

                    const faceupCharacters = cardsInProvinces.filter(a => a.isFaceup() && a.getType() === CardType.Character);

                    const hasValidCharacters = faceupCharacters.some(a => {
                        return (a.printedCost || 0) <= (card.printedCost || 0) &&
                            AbilityDsl.actions.putIntoPlay().canAffect(a, contextCopy);
                    });
                    return hasValidCharacters;
                }
            }),
            cannotTargetFirst: true,
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => (card.printedCost ?? 0) <=
                    ((context.costs.sacrificeStateWhenChosen as DrawCard | undefined)?.printedCost || 10),
                location: Location.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.putIntoPlay(),
                    AbilityDsl.actions.gainHonor(context => ({
                        amount: 1,
                        target: context.player
                    }))
                ])
            },
            effect: 'put {0} into play and gain 1 honor'
        });
    }
}
