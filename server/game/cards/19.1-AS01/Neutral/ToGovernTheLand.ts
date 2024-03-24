import type { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { CardTypes, ConflictTypes, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { GameAction } from '../../../GameActions/GameAction';

export default class ToGovernTheLand extends DrawCard {
    static id = 'to-govern-the-land';

    public setupCardAbilities() {
        this.action({
            title: "Send home and bow based on bushi's power",
            condition: (context) => this.conditionToTrigger(ConflictTypes.Political, context),
            target: {
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: (card, context) => this.conditionToTarget(ConflictTypes.Political, card, context),
                gameAction: this.gameAction()
            }
        });

        this.action({
            title: "Send home and bow based on courtier's power",
            condition: (context) => this.conditionToTrigger(ConflictTypes.Military, context),
            target: {
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: (card, context) => this.conditionToTarget(ConflictTypes.Military, card, context),
                gameAction: this.gameAction()
            }
        });
    }

    private governSkill(conflictType: ConflictTypes, card: DrawCard): number {
        switch (conflictType) {
            case ConflictTypes.Political:
                return card.getMilitarySkill();
            case ConflictTypes.Military:
                return card.getPoliticalSkill();
            default:
                return NaN;
        }
    }

    private governFulfillTrait(conflictType: ConflictTypes, context: AbilityContext, card: DrawCard): boolean {
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

    private conditionToTrigger(conflictType: ConflictTypes, context: AbilityContext): boolean {
        return (
            context.game.isDuringConflict(conflictType) &&
            (context.game.currentConflict.getParticipants() as DrawCard[]).some((card) =>
                this.governFulfillTrait(conflictType, context, card)
            )
        );
    }

    private conditionToTarget(conflictType: ConflictTypes, card: DrawCard, context: AbilityContext): boolean {
        if (!card.isParticipating()) {
            return false;
        }

        const maxSkillExclusive = (context.game.currentConflict.getParticipants() as DrawCard[]).reduce(
            (max, myCard) => {
                if (!this.governFulfillTrait(conflictType, context, myCard)) {
                    return max;
                }

                const milSkill = this.governSkill(conflictType, myCard);
                return milSkill > max ? milSkill : max;
            },
            0
        );
        return this.governSkill(conflictType, card) < maxSkillExclusive;
    }

    private gameAction(): GameAction {
        return AbilityDsl.actions.multiple([AbilityDsl.actions.sendHome(), AbilityDsl.actions.bow()]);
    }
}
