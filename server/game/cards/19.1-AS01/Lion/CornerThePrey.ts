import AbilityContext = require('../../../AbilityContext');
import { ConflictTypes, CardTypes, TargetModes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class CornerThePrey extends DrawCard {
    static id = 'corner-the-prey';

    public setupCardAbilities() {
        this.action({
            title: 'Sacrifice followers to kill',
            condition: (context) => context.game.isDuringConflict(ConflictTypes.Military),
            cost: AbilityDsl.costs.sacrifice({
                cardType: [CardTypes.Character, CardTypes.Attachment],
                mode: TargetModes.Unlimited,
                cardCondition: (card: BaseCard) =>
                    card.hasTrait('follower') &&
                    (card.isParticipating() || (card.parent && card.parent.isParticipating()))
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.printedCost <= this.getFollowerCount(context),
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            cannotTargetFirst: true
        });
    }

    private getFollowerCount(context: AbilityContext): number {
        if (context.costs.sacrifice) {
            return context.costs.sacrifice.length;
        }
        const myFollowers = (context.game.allCards as BaseCard[]).filter(
            (card) => card.controller === context.player && card.hasTrait('follower')
        );
        const myParticipatingFollowers = myFollowers.filter(
            (card) => card.isParticipating() || (card.parent && card.parent.isParticipating())
        );
        const amount = myParticipatingFollowers.length;
        return amount;
    }
}
