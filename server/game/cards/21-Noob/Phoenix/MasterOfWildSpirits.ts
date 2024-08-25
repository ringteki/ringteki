import AbilityDsl from '../../../abilitydsl';
import { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class MasterOfWildSpirits extends DrawCard {
    static id = 'master-of-wild-spirits';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.getMilitarySkill() >= 6,
            effect: [AbilityDsl.effects.addTrait('berserker')]
        });

        this.action({
            title: 'Embrace the strength of the spirits!',
            condition: (context) =>
                this.game.currentConflict instanceof Conflict &&
                context.source.isParticipating() &&
                this.game.currentConflict
                    .getCharacters(context.player)
                    .every(
                        (character) =>
                            character === context.source || character.hasSomeTrait(new Set(['creature', 'spirit']))
                    ),
            gameAction: AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyBothSkills(4)
            }),
            effect: 'give {0} +{1}{2}/+{3}{4}',
            effectArgs: () => [4, 'military', 4, 'political']
        });
    }
}
