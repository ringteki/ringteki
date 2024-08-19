import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TatooedMan extends DrawCard {
    static id = 'tatooed-man';

    public setupCardAbilities() {
        this.reaction({
            title: 'Ready this character',
            when: {
                onMoveFate: (event) => event.recipient?.type === 'ring',
                onPlaceFateOnUnclaimedRings: (event) =>
                    event.recipients.some((recipient: any) => recipient.ring?.type === 'ring')
            },
            gameAction: AbilityDsl.actions.ready((context) => ({ target: context.source }))
        });
    }
}