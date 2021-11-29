const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Durations, EffectNames } = require('../../../Constants.js');

class MirumotoRei extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a skill bonus based on attachments',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card.hasTrait('bushi') && card !== context.source,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                    const milModifiers = context.target.getEffects(EffectNames.AttachmentMilitarySkillModifier);
                    const milBonus = milModifiers.reduce((a, b) => a + b, 0);

                    const polModifiers = context.target.getEffects(EffectNames.AttachmentPoliticalSkillModifier);
                    const polBonus = polModifiers.reduce((a, b) => a + b, 0);
                    return {
                        target: context.source,
                        effect: [
                            AbilityDsl.effects.modifyMilitarySkill(milBonus),
                            AbilityDsl.effects.modifyPoliticalSkill(polBonus)
                        ],
                        duration: Durations.UntilEndOfConflict
                    };
                })
            },
            effect: 'give {1} a skill bonus equal to the total attachment skill bonus on {0} ({2}{3}/{4}{5})',
            effectArgs: context => {
                const milModifiers = context.target.getEffects(EffectNames.AttachmentMilitarySkillModifier);
                const milBonus = milModifiers.reduce((a, b) => a + b, 0);

                const polModifiers = context.target.getEffects(EffectNames.AttachmentPoliticalSkillModifier);
                const polBonus = polModifiers.reduce((a, b) => a + b, 0);

                return [
                    context.source,
                    milBonus,
                    'military',
                    polBonus,
                    'political'
                ];
            }
        });
    }
}

MirumotoRei.id = 'mirumoto-rei';

module.exports = MirumotoRei;


