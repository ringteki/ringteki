const DrawCard = require('../../../drawcard.js');
const { AbilityTypes, CardTypes, Players, TargetModes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class WritOfSurvey extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'title': 1 }
        });

        this.persistentEffect({
            condition: context => context.source.parent.isHonored,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Bow a participating dishonored character',
                condition: context => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    mode: TargetModes.Single,
                    cardCondition: card => card.isParticipating() && card.isDishonored,
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }

    canPlayOn(source) {
        return source.isHonored && super.canPlayOn(source);
    }
}

WritOfSurvey.id = 'writ-of-survey';

module.exports = WritOfSurvey;
