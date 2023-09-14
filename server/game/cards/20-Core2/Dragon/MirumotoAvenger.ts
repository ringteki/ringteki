import { CardTypes, Players, Durations, DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class MirumotoAvenger extends DrawCard {
    static id = 'mirumoto-avenger';

    public setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            title: 'Initiate a military duel, discarding the loser',
            initiateDuel: {
                type: DuelTypes.Military,
                requiresConflict: false,
                gameAction: duel => AbilityDsl.actions.discardFromPlay({ target: duel.loser })
            },
        });
    }
}
