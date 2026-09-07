import DrawCard from '../../../DrawCard.js';
import { Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class APoisonedBanquet extends DrawCard {
    static id = 'a-poisoned-banquet';

    setupCardAbilities() {
        this.interrupt({
            title: 'Injure everyone poisoned',
            when: {
                onPhaseEnded: event => event.phase === Phases.Conflict
            },
            gameAction: AbilityDsl.actions.injure((context: AbilityContext) => ({
                target: context.game.findAnyCardsInPlay(card => card.attachments.some(attachment => attachment.hasTrait('poison')))
            })),
            limit: AbilityDsl.limit.perRound(1)
        });
    }
}
