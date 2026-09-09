import AbilityDsl from '../../../abilitydsl.js';
import { EventName } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    private defendingAtConflictResolution = false;
    private eventRegistrar?: EventRegistrar;

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.AfterConflict, EventName.OnConflictDeclared]);

        // "After the resolution of a conflict" is onConflictFinished, not onReturnHome:
        // until-end-of-conflict effects (e.g. Palm Strike's cannot-ready) expire only
        // once the conflict ends. Participation is captured while it is still known.
        this.reaction({
            title: 'Ready a character or gain honor',
            when: {
                onConflictFinished: () => this.defendingAtConflictResolution
            },
            gameAction: AbilityDsl.actions.conditional((context: AbilityContext) => ({
                condition: (context as TriggeredAbilityContext).event.conflict?.winner === context.source.controller,
                trueGameAction: AbilityDsl.actions.gainHonor({ target: context.player, amount: 2 }),
                falseGameAction: AbilityDsl.actions.ready({ target: context.source })
            }))
        });
    }

    public afterConflict() {
        this.defendingAtConflictResolution = this.isDefending();
    }

    public onConflictDeclared() {
        this.defendingAtConflictResolution = false;
    }
}
