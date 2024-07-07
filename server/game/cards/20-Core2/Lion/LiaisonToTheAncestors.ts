import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class LiaisonToTheAncestors extends DrawCard {
    static id = 'liaison-to-the-ancestors';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Protect the honor of a character',
            when: {
                onCardDishonored: (event: { card: DrawCard }, context) =>
                    event.card.type === CardTypes.Character &&
                    event.card.controller === context.player &&
                    (context.player.dynastyDiscardPile as Array<DrawCard>).some(
                        (card) => event.card.printedCost < card.printedCost
                    )
            },
            gameAction: AbilityDsl.actions.honor((context: any) => ({
                target: context.event.card
            }))
        });
    }
}