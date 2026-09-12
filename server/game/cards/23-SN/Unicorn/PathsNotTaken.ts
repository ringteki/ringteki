import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class PathsNotTaken extends DrawCard {
    static id = 'paths-not-taken';

    setupCardAbilities() {
        this.reaction({
            title: 'Send home a character',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                onConflictStarted: (event, context) => event.conflict.defendingPlayer === context.player
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    card.printedCost !== null && card.printedCost < this.getSkillThreshold(context),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }

    getSkillThreshold(context: AbilityContext) {
        if(!context.game.currentConflict) {
            return 0;
        }

        const attackedProvinces = context.game.currentConflict.getConflictProvinces();
        const hasScout = context.game.currentConflict.getDefenders(card => card.hasTrait('scout')).length > 0;

        if(hasScout) {
            const strengths = attackedProvinces.map(a => a.getStrength());
            return Math.max(...strengths);
        }

        const strengths = attackedProvinces.map(a => a.getBaseStrength());
        return Math.max(...strengths);
    }
}
