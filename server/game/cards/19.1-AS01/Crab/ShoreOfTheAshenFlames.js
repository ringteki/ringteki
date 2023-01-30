const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class ShoreOfTheAshenFlames extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            match: (card) => card.type === CardTypes.Character,
            targetController: Players.Opponent,
            effect: [
                AbilityDsl.effects.suppressEffects(
                    (effect) =>
                        effect.context.source.type === CardTypes.Attachment &&
                        effect.isSkillModifier() &&
                        effect.getValue() > 0
                ),
                AbilityDsl.effects.cannotApplyLastingEffects(
                    (effect) =>
                        effect.context.source.type === CardTypes.Attachment &&
                        effect.isSkillModifier() &&
                        effect.getValue() > 0
                )
            ]
        });
    }
}

ShoreOfTheAshenFlames.id = 'shore-of-the-ashen-flames';

module.exports = ShoreOfTheAshenFlames;
