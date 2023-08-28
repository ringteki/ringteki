import type AbilityContext from '../../../AbilityContext';
import { CardTypes, EventNames } from '../../../Constants';
import { EventRegistrar } from '../../../EventRegistrar';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class NewCensure extends DrawCard {
    static id = 'new-censure';

    private censuresPlayedDuringPhase = 0;
    private eventRegistrar?: EventRegistrar;

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnPhaseStarted]);

        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event) => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            cost: AbilityDsl.costs.payFate(() => this.censuresPlayedDuringPhase),
            gameAction: AbilityDsl.actions.cancel(),
            then: () => {
                this.censuresPlayedDuringPhase += 1;
            }
        });
    }

    canPlay(context: AbilityContext, playType) {
        return context.player.imperialFavor !== '' && super.canPlay(context, playType);
    }

    onPhaseStarted() {
        this.censuresPlayedDuringPhase = 0;
    }
}
