import BaseAction from '../../../BaseAction';
import { DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class MatsuNobuiko extends DrawCard {
    static id = 'matsu-nobuiko';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.player.opponent &&
                    (context.source as DrawCard).isParticipating() &&
                    (event.context.ability as BaseAction).abilityType === 'action'
            },
            initiateDuel: (context) => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) =>
                    duel.winner && duel.winningPlayer === context.player && AbilityDsl.actions.cancel()
            })
        });
    }
}
