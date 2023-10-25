import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class StrikeBeneathTheVeil extends DrawCard {
    static id = 'strike-beneath-the-veil';

    setupCardAbilities() {
        this.action({
            title: 'Give a military penalty to a participating character',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card: DrawCard) => card.isParticipating('military') && card.hasTrait('bushi')
                ),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(this.#penalty(context.target))
                }))
            },
            effect: 'give {0} {1} military',
            effectArgs: (context) => [this.#penalty(context.target)]
        });
    }

    #penalty(target: DrawCard): number {
        return -2 * target.attachments.length;
    }
}
