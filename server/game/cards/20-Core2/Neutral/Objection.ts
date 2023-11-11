import AbilityContext from '../../../AbilityContext';
import { CardTypes, EventNames, Locations, Players } from '../../../Constants';
import { EventRegistrar } from '../../../EventRegistrar';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Objection extends DrawCard {
    static id = 'objection-';

    private copiesPlayedDuringPhase = new Array<string>();
    private eventRegistrar?: EventRegistrar;

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnPhaseStarted, EventNames.OnCardPlayed]);

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            // increaseCost doesn't take a variable argument so we use a negative reduce cost
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) =>
                    -1 * this.copiesPlayedDuringPhase.filter((uuid) => uuid === player.uuid).length,
                match: (card, source) => card === source
            })
        });

        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event) => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    canPlay(context: AbilityContext, playType) {
        return context.player.imperialFavor !== '' && super.canPlay(context, playType);
    }

    onCardPlayed(event: any) {
        if (event.card.name === this.name) {
            this.copiesPlayedDuringPhase.push(event.player.uuid);
        }
    }

    onPhaseStarted() {
        this.copiesPlayedDuringPhase.length = 0;
    }
}
