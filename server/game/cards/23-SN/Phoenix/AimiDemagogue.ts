import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import { GameAction } from '../../../GameActions/GameAction.js';

export default class AimiDemagogue extends DrawCard {
    static id = 'aimi-demagogue';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Give pride',
            target: {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.multipleContext(context => {
                    const gameActions: GameAction[] = [];

                    gameActions.push(AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.addKeyword('pride'),
                        target: context.target
                    }));

                    if(context.target.controller !== context.player) {
                        gameActions.push(AbilityDsl.actions.cardLastingEffect({
                            effect: AbilityDsl.effects.addKeyword('pride'),
                            target: context.source
                        }));
                    }
                    return { gameActions };
                })
            },
            effect: 'give {1}{0} pride the end of the conflict',
            effectArgs: (context) => [context.target?.controller !== context.player ? 'itself and ' : '']
        });
    }
}
