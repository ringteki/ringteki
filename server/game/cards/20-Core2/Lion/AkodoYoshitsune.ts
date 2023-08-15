import { Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class AkodoYoshitsune extends DrawCard {
    static id = 'akodo-yoshitsune';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.ConflictDeck,
            match: (card, context) => context && card === context.player.conflictDeck.first(),
            effect: AbilityDsl.effects.hideWhenFaceUp()
        });

        this.persistentEffect({
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopConflictCard()
        });

        this.reaction({
            title: 'Gain an honor',
            when: {
                afterConflict: (event, context) => (event.conflict as Conflict | undefined)?.winner === context.player
            },
            gameAction: AbilityDsl.actions.gainHonor((context) => ({ target: context.player })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}
