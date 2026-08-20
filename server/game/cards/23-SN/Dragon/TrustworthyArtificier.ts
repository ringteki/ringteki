import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class TrustworthyArtificier extends DrawCard {
    static id = 'trustworthy-artificier';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.type === 'ring' &&
                    event.recipient && event.recipient === context.player
            },
            gameAction: AbilityDsl.actions.draw(),
        });
    }
}