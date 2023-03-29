const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { ConflictTypes, CardTypes, TargetModes } = require('../../../Constants.js');

class ToGovernTheLand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home and bow based on bushi\'s power',
            condition: (context) => this.governCondition(ConflictTypes.Political, context),
            target: {
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: (card, context) => this.governCardCondition(ConflictTypes.Political, card, context),
                gameAction: this.governGameAction()
            }
        });

        this.action({
            title: 'Send home and bow based on courtier\'s power',
            condition: (context) => this.governCondition(ConflictTypes.Military, context),
            target: {
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: (card, context) => this.governCardCondition(ConflictTypes.Military, card, context),
                gameAction: this.governGameAction()
            }
        });
    }

    governSkill(conflictType, card) {
        switch(conflictType) {
            case ConflictTypes.Political:
                return card.getMilitarySkill();
            case ConflictTypes.Military:
                return card.getPoliticalSkill();
            default:
                return NaN;
        }
    }

    governFulfillTrait(conflictType, context, card) {
        switch(conflictType) {
            case ConflictTypes.Political:
                return card.controller === context.player && card.hasTrait('bushi');
            case ConflictTypes.Military:
                return card.controller === context.player && card.hasTrait('courtier');
            default:
                return false;
        }
    }

    governCondition(conflictType, context) {
        return (
            context.game.isDuringConflict(conflictType) &&
            context.game.currentConflict
                .getParticipants()
                .some((card) => this.governFulfillTrait(conflictType, context, card))
        );
    }

    governCardCondition(conflictType, card, context) {
        if(!card.isParticipating()) {
            return false;
        }

        let maxSkillExclusive = context.game.currentConflict.getParticipants().reduce((max, myCard) => {
            if(!this.governFulfillTrait(conflictType, context, myCard)) {
                return max;
            }

            let milSkill = this.governSkill(conflictType, myCard);
            return milSkill > max ? milSkill : max;
        }, 0);
        return this.governSkill(conflictType, card) < maxSkillExclusive;
    }

    governGameAction() {
        return AbilityDsl.actions.multiple([AbilityDsl.actions.sendHome(), AbilityDsl.actions.bow()]);
    }
}

ToGovernTheLand.id = 'to-govern-the-land';

module.exports = ToGovernTheLand;
