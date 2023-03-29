const DrawCard = require('../../../drawcard.js');
const { Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class TheLionsShadow extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: ['courtier', 'scout']
        });

        this.persistentEffect({
            condition: (context) => context.game.currentPhase === Phases.Fate,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            condition: (context) => context.source.parent.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });

        this.whileAttached({
            condition: (context) =>
                context.source.parent.isAttacking() &&
                context.game.currentConflict.getNumberOfParticipantsFor('attacker') === 1,
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}

TheLionsShadow.id = 'the-lion-s-shadow';

module.exports = TheLionsShadow;
