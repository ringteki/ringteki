import { CardTypes, ConflictTypes, EffectNames, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import Conflict = require('../../../conflict');
import ProvinceCard = require('../../../provincecard');

export default class ShoreOfTheAshenFlames extends ProvinceCard {
    static id = 'shore-of-the-ashen-flames';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.changeConflictSkillFunctionPlayer((card: BaseCard, conflict: Conflict) => {
                const exclusionFunction = (effect: any) => {
                    if (effect.type === EffectNames.AttachmentMilitarySkillModifier) {
                        const value = effect.getValue(card);
                        return value > 0;
                    }
                    if (effect.type === EffectNames.AttachmentPoliticalSkillModifier) {
                        const value = effect.getValue(card);
                        return value > 0;
                    }
                    if (
                        effect.type === EffectNames.ModifyMilitarySkill ||
                        effect.type === EffectNames.ModifyPoliticalSkill ||
                        effect.type === EffectNames.ModifyBothSkills
                    ) {
                        if (effect.context && effect.context.source) {
                            const source = effect.context.source;
                            return source && source.type === CardTypes.Attachment;
                        }
                        return false;
                    }
                };

                if (conflict.conflictType === ConflictTypes.Military) {
                    return card.getMilitarySkillExcludingModifiers(exclusionFunction);
                }
                return card.getPoliticalSkillExcludingModifiers(exclusionFunction);
            })
        });
    }
}
