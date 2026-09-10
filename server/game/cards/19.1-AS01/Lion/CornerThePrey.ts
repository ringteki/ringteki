import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, ConflictType, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CornerThePrey extends DrawCard {
    static id = 'corner-the-prey';

    public setupCardAbilities() {
        this.action({
            title: 'Sacrifice followers to kill',
            condition: (context) => context.game.isDuringConflict(ConflictType.Military),
            cost: AbilityDsl.costs.sacrifice({
                cardType: [CardType.Character, CardType.Attachment],
                mode: TargetMode.Unlimited,
                // A follower can be attached to a province, which does not participate.
                cardCondition: (card) =>
                    card.hasTrait('follower') &&
                    (card.isParticipating() || (card.parent instanceof DrawCard && card.parent.isParticipating()))
            }),
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && (card.printedCost ?? 0) <= this.getFollowerCount(context),
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            cannotTargetFirst: true
        });
    }

    private getFollowerCount(context: AbilityContext): number {
        if(context.costs.sacrifice) {
            return (context.costs.sacrifice as BaseCard[]).length;
        }
        const myFollowers = (context.game.allCards as BaseCard[]).filter(
            (card) => card.controller === context.player && card.hasTrait('follower')
        );
        const myParticipatingFollowers = myFollowers.filter(
            (card) => card instanceof DrawCard &&
                (card.isParticipating() || (card.parent instanceof DrawCard && card.parent.isParticipating()))
        );
        const amount = myParticipatingFollowers.length;
        return amount;
    }
}
