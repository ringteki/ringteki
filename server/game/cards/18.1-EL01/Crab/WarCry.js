const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes, EffectNames, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class WarCry extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Double a character\'s military skill',
            condition: context => context.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('berserker'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.modifyMilitarySkill(context.target.getMilitarySkillExcludingModifiers([EffectNames.AttachmentMilitarySkillModifier, EffectNames.AttachmentPoliticalSkillModifier]))
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            message: '{1} is sacrificed due to {0}\'s delayed effect',
                            messageArgs: [context.source, context.target],
                            gameAction: AbilityDsl.actions.sacrifice()
                        })
                    }))
                ])
            },
            effect: 'give {0} +{1}{2} and sacrifice it at the end of the conflict',
            effectArgs: context => [context.target.getMilitarySkillExcludingModifiers([EffectNames.AttachmentMilitarySkillModifier, EffectNames.AttachmentPoliticalSkillModifier]), 'military']
        });
    }
}

WarCry.id = 'war-cry';

module.exports = WarCry;
