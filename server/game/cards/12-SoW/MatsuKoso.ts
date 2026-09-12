import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class MatsuKoso extends DrawCard {
    static id = 'matsu-koso';

    setupCardAbilities() {
        this.action({
            title: 'Lower military skill',
            condition: (context) => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: this.getTargets(context),
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.modifyMilitarySkill((card: DrawCard) => -card.printedPoliticalSkill)
            })),
            effect: 'lower the military skill of {1} by their respective printed political skill',
            effectArgs: (context) => [this.getTargets(context)]
        });
    }

    // A dash or 0 printed political skill would change nothing, and applying the effect
    // anyway triggers reactions to a skill change (Kiss of the Sea).
    getTargets(context: AbilityContext) {
        return (context.game.currentConflict?.getParticipants() ?? []).filter(
            (card: DrawCard) => card.printedPoliticalSkill > 0
        );
    }
}


export default MatsuKoso;
