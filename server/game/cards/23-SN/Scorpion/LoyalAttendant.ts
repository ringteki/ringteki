import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import { shuffle } from '../../../utils/shuffle.js';

export default class LoyalAttendant extends DrawCard {
    static id = 'loyal-attendant';

    public setupCardAbilities() {
        this.conflictAction({
            title: 'Discard a card',
            target: {
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.attachments.filter(a => a.controller === context.player).length > 0
            },
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                let cardNumber = (context.target as DrawCard).attachments.length;
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
            }),
            effect: 'look at {2} random cards in {1}\'s hand and discard one of them',
            effectArgs: (context) => [
                context.player.opponent as Player,
                (context.target as DrawCard)?.attachments?.length
            ],
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
