import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';

export default class GiftOfTheNingyo extends DrawCard {
    static id = 'gift-of-the-ningyo';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context: AbilityContext<this>) => (
                Boolean(context.source.parent && (context.source.parent as DrawCard).isParticipating() &&
                    this.getCharacters(context).some(card => card.hasSomeTrait('creature', 'spirit') ||
                        card.attachments.some(attachment => attachment.hasSomeTrait('creature', 'spirit'))
                    )
                )),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
    }


    getCharacters(context: AbilityContext<this>): DrawCard[] {
        if (!context.game.currentConflict || !context.source.parent) {
            return [];
        }
        if (context.source.parent.isAttacking()) {
            return context.game.currentConflict.defenders;
        }
        return context.game.currentConflict.attackers;
    }
}
