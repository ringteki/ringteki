import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class Sato extends DrawCard {
    static id = 'sato';

    public setupCardAbilities() {
        this.attachmentConditions({ opponentControlOnly: true });

        this.reaction({
            title: 'Force opponent to lose 1 honor',
            when: {
                onCardPlayed: (event, context) =>
                    context.source.parent &&
                    event.player === context.player.opponent &&
                    context.source.parent.isParticipating()
            },
            gameAction: AbilityDsl.actions.loseHonor(),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    canPlayOn(card: BaseCard) {
        return card.getType() === CardTypes.Character && !card.isAttacking() && super.canPlayOn(card);
    }
}
