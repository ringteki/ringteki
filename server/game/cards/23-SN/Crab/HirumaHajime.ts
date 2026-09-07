import AbilityDsl from '../../../abilitydsl.js';
import { Location, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import BaseCard from '../../../BaseCard.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';

export default class HirumaHajime extends DrawCard {
    static id = 'hiruma-hajime';

    setupCardAbilities() {
        this.action({
            title: 'Move a card in a province',
            targets: {
                cardInProvince: {
                    location: [Location.Provinces, Location.PlayArea],
                    cardCondition: card =>
                        Boolean((card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold) ||
                            (card.type === CardType.Attachment && card.parent && card.parent.type === CardType.Province))
                },
                province: {
                    targets: false,
                    dependsOn: 'cardInProvince',
                    location: [Location.Provinces],
                    cardType: CardType.Province,
                    cardCondition: (card: BaseCard, context) =>
                        card.location !== Location.StrongholdProvince &&
                        !(card as ProvinceCard).isBroken &&
                        ( //same controller check
                            ((context.targets.cardInProvince as DrawCard).type === CardType.Attachment && card.controller === (context.targets.cardInProvince as DrawCard).parent?.controller) ||
                            ((context.targets.cardInProvince as DrawCard).type !== CardType.Attachment && card.controller === (context.targets.cardInProvince as DrawCard).controller)
                        ) &&
                        ( //different location check
                            ((context.targets.cardInProvince as DrawCard).type === CardType.Attachment && card.location !== (context.targets.cardInProvince as DrawCard).parent?.location) ||
                            ((context.targets.cardInProvince as DrawCard).type !== CardType.Attachment && card.location !== (context.targets.cardInProvince as DrawCard).location)
                        ),
                    gameAction: AbilityDsl.actions.conditional(context => ({
                        condition: context.targets.cardInProvince.type === CardType.Attachment,
                        trueGameAction: AbilityDsl.actions.attach({
                            target: context.targets.province,
                            attachment: context.targets.cardInProvince
                        }),
                        falseGameAction: AbilityDsl.actions.moveCard({
                            target: context.targets.cardInProvince,
                            destination: context.targets.province.location
                        })
                    }))
                }
            },
            effect: 'move {1} to {2}',
            effectArgs: context => [
                (context.targets.cardInProvince as DrawCard).isFacedown() ? 'a facedown card' : context.targets.cardInProvince as DrawCard,
                (context.targets.province as ProvinceCard).isFacedown() ? (context.targets.province as ProvinceCard).location : context.targets.province as ProvinceCard
            ],
            then: (context) => ({
                thenCondition: () => !!(context.targets.province as ProvinceCard).isConflictProvince() && (context.targets.cardInProvince as DrawCard).type !== CardType.Attachment && (context.targets.cardInProvince as DrawCard).isFaceup(),
                gameAction: AbilityDsl.actions.optional(() => ({
                    promptTitleForConfirming: 'Do you want to turn ' + (context.targets.cardInProvince as BaseCard).name + ' facedown?',
                    gameAction: AbilityDsl.actions.turnFacedown({
                        target: context.targets.cardInProvince
                    }),
                    showMessageOnNo: true,
                    effect: 'turn {1} facedown',
                    effectArgs: () => [context.player, context.targets.cardInProvince]
                }))
            })
        });
    }
}
