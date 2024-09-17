import AbilityDsl from '../../../abilitydsl';
import { DuelTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class DojiReiha extends DrawCard {
    static id = 'doji-reiha';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a duel that honors participants and move loser home',
            condition: (context) => context.source.isParticipating(),
            initiateDuel: {
                type: DuelTypes.Political,
                gameAction: (duel) =>
                    AbilityDsl.actions.sequential([
                        AbilityDsl.actions.chooseAction((context) => ({
                            player: duel.winningPlayer === context.player ? Players.Self : Players.Opponent,
                            options: {
                                'Move all duel participants home': {
                                    action: AbilityDsl.actions.sendHome({
                                        target: duel.loser.concat(...duel.winner)
                                    })
                                },
                                'Do nothing': {
                                    action: AbilityDsl.actions.noAction()
                                }
                            }
                        })),
                        AbilityDsl.actions.honor({ target: duel.participants })
                    ])
            }
        });
    }
}
