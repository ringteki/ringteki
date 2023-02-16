const AbilityDsl = require('../../../abilitydsl.js');
const { Players, ConflictTypes, EffectNames, CardTypes } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class ShoreOfTheAshenFlames extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.changeConflictSkillFunctionPlayer((card, conflict) => {
                const exclusionFunction = (effect) => {
                    if(effect.type === EffectNames.AttachmentMilitarySkillModifier) {
                        const value = effect.getValue(card);
                        return value > 0;
                    }
                    if(effect.type === EffectNames.AttachmentPoliticalSkillModifier) {
                        const value = effect.getValue(card);
                        return value > 0;
                    }
                    if(effect.type === EffectNames.ModifyMilitarySkill || effect.type === EffectNames.ModifyPoliticalSkill || effect.type === EffectNames.ModifyBothSkills) {
                        if(effect.context && effect.context.source) {
                            const source = effect.context.source;
                            return source && source.type === CardTypes.Attachment;
                        }
                        return false;
                    }
                };

                if(conflict.conflictType === ConflictTypes.Military) {
                    return card.getMilitarySkillExcludingModifiers(exclusionFunction);
                }
                return card.getPoliticalSkillExcludingModifiers(exclusionFunction);
            })
        });
    }
}

ShoreOfTheAshenFlames.id = 'shore-of-the-ashen-flames';

module.exports = ShoreOfTheAshenFlames;
