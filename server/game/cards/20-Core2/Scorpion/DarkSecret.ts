import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DarkSecret extends DrawCard {
    static id = 'dark-secret';

    setupCardAbilities() {
        this.reaction({
            title: 'Make the controller of attached character lose 1 honor',
            when: {
                onMoveFate: (event, context) =>
                    context.source.parent && event.origin === context.source.parent && event.fate > 0
            },
            gameAction: AbilityDsl.actions.loseHonor((context) => ({ amount: 1, target: context.source.parent })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}
