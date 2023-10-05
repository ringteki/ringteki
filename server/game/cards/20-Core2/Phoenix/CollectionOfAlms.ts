import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { GameAction } from '../../../GameActions/GameAction';
import type { Result } from '../../../gamesteps/FateBidPrompt';

export default class CollectionOfAlms extends DrawCard {
    static id = 'collection-of-alms';

    public setupCardAbilities() {
        this.action({
            title: 'Collect donations for those in need',
            condition: (context) => context.player.isTraitInPlay('courtier'),
            gameAction: AbilityDsl.actions.fateBid({
                postBidAction: AbilityDsl.actions.sequentialContext(context => {
                    const result: Result = (context as any).fateBidResult
                    console.log(1, context)
                    const gameActions: Array<GameAction> = []
                    for (const player of result.highest.players) {
                        gameActions.push(AbilityDsl.actions.gainHonor({ target: player }))
                    }

                    return { gameActions }
                }),
            }),
            effect: 'collect donations for those in need'
        });
    }
}
