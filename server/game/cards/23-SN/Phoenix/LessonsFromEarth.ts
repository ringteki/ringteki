import AbilityDsl from '../../../abilitydsl.js';
import { GameAction } from '../../../GameActions/GameAction.js';
import { ProvinceAttachment } from '../../ProvinceAttachment.js';

export default class LessonsFromEarth extends ProvinceAttachment {
    static id = 'lessons-from-earth';

    setupCardAbilities() {
        super.setupCardAbilities();

        this.forcedReaction({
            title: 'Loser sacrifices a character',
            when: {
                afterConflict: (event, context) => {
                    return context.source.parent && event.conflict.winner && event.conflict.loser && context.source.parent.isConflictProvince()
                }
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            effect: 'cause {1} to draw a card and {2} to discard a card',
            effectArgs: context => [context.event.conflict?.winner, context.event.conflict?.loser],
            gameAction: AbilityDsl.actions.multipleContext(context => {
                const gameActions: GameAction[] = [];

                const winner = context.event.conflict.winner;
                const loser = context.event.conflict.loser;

                gameActions.push(AbilityDsl.actions.draw({
                    target: winner
                }))

                const hasAffinity = loser.hasAffinity('earth');
                if (!hasAffinity) {
                    gameActions.push(AbilityDsl.actions.chosenDiscard({
                        target: loser
                    }))
                } else {
                    gameActions.push(AbilityDsl.actions.handler({
                        handler: () => {
                            context.game.addMessage('{0}\'s affinity to Earth prevents them from discarding a card!', loser);
                        }
                    }))
                }
                return { gameActions };
            })
        });
    }
}
