import { CardTypes, Players, Durations, DuelTypes, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Suburito extends DrawCard {
    static id = 'suburito';

    public setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility('action', {
                title: 'Initiate a military duel',
                initiateDuel: {
                    type: DuelTypes.Military,
                    gameAction: duel => AbilityDsl.actions.honor({ target: duel.winner }),
                },
                printedAbility: false
            })
        });
    }
}
