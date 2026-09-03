import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AncestorAttendant extends DrawCard {
    static id = 'ancestor-attendant';

    setupCardAbilities() {
        this.conflictAction<DrawCard>({
            title: 'Dishonor a character',
            target: {
                cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent) && context.player.dynastyDeck.length >= (card.printedCost ?? 0),
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.jointContext(context => {
                    const cost = context.target.printedCost || 0;
                    const gameActions = [AbilityDsl.actions.dishonor()];

                    if(cost > 0) {
                        gameActions.push(AbilityDsl.actions.discardCard((context) => ({
                            target: context.player.dynastyDeck.slice(0, cost)
                        })));
                    }

                    return { gameActions };
                })
            },
            effect: 'dishonor {0}{1}{2}{3}',
            effectArgs: (context) => {
                return ((context.target?.printedCost ?? 0) === 0) ? ['', '', ''] :
                    [' and discard the top ', context.target?.printedCost, ' cards of their dynasty deck'];
            }
        });
    }
}
