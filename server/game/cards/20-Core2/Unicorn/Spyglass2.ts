import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Spyglass extends DrawCard {
    static id = 'spyglass-2';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source.parent),
                onMoveToConflict: (event, context) => event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
