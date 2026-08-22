import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ForwardPatrol extends DrawCard {
    static id = 'forward-patrol';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Ready a bushi',
            target: {
                cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent) && context.player.dynastyDeck.length >= (card.printedCost || 0),
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.jointContext(context => {
                    const cost = context.target.printedCost || 0;
                    const gameActions = [AbilityDsl.actions.dishonor()];

                    if (cost > 0) {
                        gameActions.push(AbilityDsl.actions.discardCard((context) => ({
                            target: context.player.dynastyDeck.slice(0, cost)
                        })))
                    }

                    return { gameActions }
                })
            },
        });
    }
}
