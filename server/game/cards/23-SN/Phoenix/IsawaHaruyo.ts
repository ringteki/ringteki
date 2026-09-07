import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import { shuffle } from '../../../utils/shuffle.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class IsawaHaruyo extends DrawCard {
    static id = 'isawa-haruyo';

    public setupCardAbilities() {
        this.conflictAction({
            title: 'Discard a card',
            condition: (context) => context.source.isDefending() && context.player.opponent !== undefined,
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
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    let cardNumber = (context.target as ProvinceCard).getStrength();
                    let cards = cardNumber
                        ? shuffle(context.player.opponent.hand).slice(0, cardNumber)
                        : [context.source];
                    return {
                        gameActions: [
                            AbilityDsl.actions.lookAt(() => ({
                                target: cards.slice().sort((a, b) => a.name.localeCompare(b.name))
                            })),
                            AbilityDsl.actions.cardMenu((context) => ({
                                cards: cards.slice().sort((a, b) => a.name.localeCompare(b.name)),
                                targets: true,
                                message: '{0} chooses {1} to be discarded',
                                messageArgs: (card) => [context.player, card],
                                gameAction: AbilityDsl.actions.discardCard()
                            }))
                        ]
                    };
                })
            })),
            effect: 'look at an amount of random cards in {1}\'s hand equal to the strength of an attacked province and discard one of them',
            effectArgs: (context) => [
                context.player.opponent as Player
            ]
        });
    }
}
