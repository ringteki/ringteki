import { CardTypes } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import type DrawCard from '../../../drawcard';

export default class AvalancheOfStone extends ProvinceCard {
    static id = 'avalanche-of-stone';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow all characters 2 cost or less',
            when: { onCardRevealed: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.bow(() => ({
                target: this.game.findAnyCardsInPlay(
                    (card: BaseCard) => card.getType() === CardTypes.Character && (card as DrawCard).costLessThan(3)
                )
            }))
        });
    }
}
