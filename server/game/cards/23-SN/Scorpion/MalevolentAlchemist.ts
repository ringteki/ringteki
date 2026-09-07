import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MalevolentAlchemist extends DrawCard {
    static id = 'malevolent-alchemist';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: (card: DrawCard) => card.type === CardType.Character,
            effect: AbilityDsl.effects.modifyBothSkills((character: DrawCard) => -1 * character.attachments.filter(a => a.hasTrait('poison')).length)
        });
    }
}
