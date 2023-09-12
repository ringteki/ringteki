import type AbilityContext from '../../../AbilityContext';
import { ConflictTypes, CardTypes, TargetModes } from '../../../Constants';
import type { GameAction } from '../../../GameActions/GameAction';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class ToGovernTheLand extends DrawCard {
    static id = 'to-govern-the-land';

    public setupCardAbilities() {
        this.action({
            title: "Send home and bow based on bushi's power",
            condition: (context) => this.#fulfillsConditionToTrigger(ConflictTypes.Political, context),
            target: {
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: (card: DrawCard, context) => this.#canTarget(ConflictTypes.Political, card, context),
                gameAction: this.#gameAction()
            }
        });

        this.action({
            title: "Send home and bow based on courtier's power",
            condition: (context) => this.#fulfillsConditionToTrigger(ConflictTypes.Military, context),
            target: {
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: (card: DrawCard, context) => this.#canTarget(ConflictTypes.Military, card, context),
                gameAction: this.#gameAction()
            }
        });
    }

    #appropriateSkill(conflictType: ConflictTypes, card: DrawCard): number {
        switch (conflictType) {
            case ConflictTypes.Political:
                return card.getMilitarySkill();
            case ConflictTypes.Military:
                return card.getPoliticalSkill();
            default:
                return NaN;
        }
    }

    #hasAppropriateTrait(conflictType: ConflictTypes, context: AbilityContext, card: BaseCard): boolean {
        if (card.controller !== context.player) {
            return false;
        }

        switch (conflictType) {
            case ConflictTypes.Political:
                return card.hasTrait('bushi');
            case ConflictTypes.Military:
                return card.hasTrait('courtier');
            default:
                return false;
        }
    }

    #fulfillsConditionToTrigger(conflictType: ConflictTypes, context: AbilityContext): boolean {
        return (
            context.game.isDuringConflict(conflictType) &&
            (context.game.currentConflict.getParticipants() as BaseCard[]).some((card) =>
                this.#hasAppropriateTrait(conflictType, context, card)
            )
        );
    }

    #canTarget(conflictType: ConflictTypes, card: DrawCard, context: AbilityContext): boolean {
        if (!card.isParticipating()) {
            return false;
        }

        const maxSkillExclusive = (context.game.currentConflict.getParticipants() as DrawCard[]).reduce(
            (max, myCard) => {
                if (!this.#hasAppropriateTrait(conflictType, context, myCard)) {
                    return max;
                }

                const milSkill = this.#appropriateSkill(conflictType, myCard);
                return milSkill > max ? milSkill : max;
            },
            0
        );
        return this.#appropriateSkill(conflictType, card) < maxSkillExclusive;
    }

    #gameAction(): GameAction {
        return AbilityDsl.actions.multiple([AbilityDsl.actions.sendHome(), AbilityDsl.actions.bow()]);
    }
}
