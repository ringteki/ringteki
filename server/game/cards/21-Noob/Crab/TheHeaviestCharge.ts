import AbilityDsl from '../../../abilitydsl';
import { Phases } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class TheHeaviestCharge extends DrawCard {
    static id = 'the-heaviest-charge';

    setupCardAbilities() {
        this.action({
            title: 'Make players who lose conflicts also lose honor',
            phase: Phases.Conflict,
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                return {
                    gameActions: context.game.getPlayers().map((player) =>
                        AbilityDsl.actions.playerLastingEffect((context) => ({
                            targetController: player,
                            effect: AbilityDsl.effects.additionalPlayCost((context) => [
                                AbilityDsl.costs.giveHonorToOpponent(1)
                            ])
                        }))
                    )
                };
            }),
            effect: 'make {1} lose 1 honor',
            effectArgs: (context) => [context.game.currentConflict?.loser.name],
            max: AbilityDsl.limit.perRound(1)
        });
    }
}