import { CardType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class HeartOfTheInferno extends DrawCard {
    static id = 'heart-of-the-inferno';

    setupCardAbilities() {
        this.action({
            title: 'Bow a card',
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')
                ),
            target: {
                mode: TargetMode.Single,
                controller: Players.Opponent,
                // On the enemy side: a participating character, or an attachment on one.
                // An opponent's attachment on your own character is on your side, and a
                // ring or province parent is not a DrawCard and is on no side at all.
                cardCondition: (card: DrawCard, context) => !!context.player.opponent &&
                    (card.isParticipatingFor(context.player.opponent) ||
                        (card.parent instanceof DrawCard &&
                            card.parent.isParticipatingFor(context.player.opponent))),
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    if(!(context.target instanceof DrawCard)) {
                        return { gameActions: [] };
                    }

                    const gameActions: Array<GameAction> = [];
                    if(context.target.type === CardType.Character && context.target.attachments.length === 0) {
                        gameActions.push(AbilityDsl.actions.bow({ target: context.target }));
                    }
                    if(context.target.type === CardType.Attachment && context.player.hasAffinity('fire', context)) {
                        gameActions.push(AbilityDsl.actions.discardFromPlay({ target: context.target }));
                    }

                    return { gameActions };
                })
            }
        });
    }
}
