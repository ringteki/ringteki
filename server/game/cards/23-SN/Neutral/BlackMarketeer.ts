import DrawCard from '../../../DrawCard.js';
import { CardType, Location, PlayType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class BlackMarketeer extends DrawCard {
    static id = 'black-marketeer';

    setupCardAbilities() {
        this.action({
            title: 'Play an attachment',
            effect: 'buy an attachment from {1}\'s discard pile',
            effectArgs: context => [context.player.opponent],
            target: {
                cardType: CardType.Attachment,
                controller: Players.Opponent,
                location: Location.ConflictDiscardPile,
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayType.PlayFromHand,
                    payFateToOpponent: true,
                }),
            }
        });
    }
}
