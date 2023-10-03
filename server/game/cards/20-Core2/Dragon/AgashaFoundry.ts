import { Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AgashaFoundry extends DrawCard {
    static id = 'agasha-foundry';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Satisfy Affinity for the next Spell',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && (event.card as DrawCard).hasTrait('spell')
            },
            gameAction: AbilityDsl.actions.playerLastingEffect(({
                targetController: Players.Self,
                duration: Durations.UntilSelfPassPriority,
                effect: AbilityDsl.effects.satisfyAffinity(['air', 'earth', 'fire', 'water', 'void'])
            })),
            effect: "satisfy all elemental affinities"
        });

    }
}
