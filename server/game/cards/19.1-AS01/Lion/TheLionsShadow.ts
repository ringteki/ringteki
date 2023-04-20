import AbilityContext = require('../../../AbilityContext');
import { Phases } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');

export default class TheLionsShadow extends DrawCard {
    static id = 'the-lion-s-shadow';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: ['courtier', 'scout']
        });

        this.persistentEffect({
            condition: (context) => context.game.currentPhase === Phases.Fate,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            condition: (context: AbilityContext) => context.source.parent.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });

        this.whileAttached({
            condition: (context: AbilityContext) =>
                context.source.parent.isAttacking() &&
                context.game.currentConflict.getNumberOfParticipantsFor('attacker') === 1,
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}
