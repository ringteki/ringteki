import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class WardOfThorns extends DrawCard {
    static id = 'ward-of-thorns';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: (context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.hasTrait('shugenja') && card.hasTrait('earth')),
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

    canPlay(context, playType) {
        return (
            context.player.cardsInPlay.any(
                (card) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }

    canPlayOn(source) {
        return this.#isAllowedToAttach(source);
    }

    canAttach(parent) {
        return this.#isAllowedToAttach(parent);
    }

    #isAllowedToAttach(source) {
        return (
            source &&
            source.controller === this.controller &&
            source.getType() === CardTypes.Province &&
            this.getType() === CardTypes.Attachment
        );
    }
}
