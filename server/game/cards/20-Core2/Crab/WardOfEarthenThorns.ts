import type AbilityContext from '../../../AbilityContext';
import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class WardOfEarthenThorns extends DrawCard {
    static id = 'ward-of-earthen-thorns';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: (context) =>
                context.player.cardsInPlay.some((card: DrawCard) => card.hasEveryTrait('shugenja', 'earth')),
            match: (card, context) => context.source.parent === card,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });

        this.action({
            title: 'Remove a fate from a character',
            condition: (context) =>
                context.game.currentConflict
                    .getConflictProvinces()
                    .some((province) => context.source.parent === province),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.removeFate()
            }
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.any(
                (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }

    canPlayOn(source: BaseCard) {
        return this.#isAllowedToAttach(source);
    }

    canAttach(parent: BaseCard) {
        return this.#isAllowedToAttach(parent);
    }

    #isAllowedToAttach(source: BaseCard) {
        return (
            source &&
            source.controller === this.controller &&
            source.getType() === CardTypes.Province &&
            this.getType() === CardTypes.Attachment
        );
    }
}
