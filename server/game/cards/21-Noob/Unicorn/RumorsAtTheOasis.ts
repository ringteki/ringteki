import type { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { PlayTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type Player from '../../../player';

export default class RumorsAtTheOasis extends DrawCard {
    static id = 'rumors-at-the-oasis';

    setupCardAbilities() {
        this.action({
            title: 'Name a card that your opponent cannot play for the phase',
            condition: (context) => context.player.anyCardsInPlay((card: DrawCard) => card.hasTrait('courtier')),
            handler: (context) =>
                this.game.promptWithMenu(context.player, this, {
                    context: context,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                }),
            max: AbilityDsl.limit.perRound(1)
        });
    }

    selectCardName(player: Player, cardName: string, context: AbilityContext) {
        this.game.addMessage(
            '{0} names {1} - {2} cannot play copies of this card this phase',
            player,
            cardName,
            player.opponent
        );
        context.source.untilEndOfPhase(() => ({
            targetController: context.player.opponent,
            effect: AbilityDsl.effects.playerCannot({
                cannot: PlayTypes.PlayFromHand,
                restricts: 'copiesOfX',
                source: context.source,
                params: cardName
            })
        }));
        return true;
    }
}
