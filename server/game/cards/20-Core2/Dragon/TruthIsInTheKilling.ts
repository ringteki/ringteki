import { CardTypes, DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TruthIsInTheKilling extends DrawCard {
    static id = 'truth-is-in-the-killing';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel, discarding the loser',
            condition: context => context.game.isDuringConflict('military'),
            initiateDuel: {
                type: DuelTypes.Military,
                challengerCondition: (card) => card.hasTrait('duelist') && card.isParticipating(),
                gameAction: (duel) => duel.loser && AbilityDsl.actions.sequentialContext(() => {
                    const gameActions = [];
                    duel.loser.forEach((loser) => {
                        gameActions.push(AbilityDsl.actions.removeFate({
                            target: loser,
                            amount: loser.getFate(),
                            recipient: loser.controller
                        })),
                        gameActions.push(AbilityDsl.actions.discardFromPlay({
                            target: duel.loser
                        }))
                    })
                    return { gameActions };
                }),
                message: 'discard {0}, returning all fate on them to {1}\'s fate pool',
                messageArgs: (duel) => [duel.loser, duel.losingPlayer],
            }
        });
    }
}
