import AbilityContext from '../../../AbilityContext';
import { CardTypes, Durations, Locations } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AntelopeCanyon extends ProvinceCard {
    static id = 'antelope-canyon';

    public setupCardAbilities() {
        this.action({
            title: "Look at random cards from opponent's hand",
            target: {
                activePromptTitle: 'Choose a character to lead the investigation',
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isDefending() && context.player.opponent !== undefined
            },
            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => context.player.opponent?.hand.size() > 0,
                falseGameAction: AbilityDsl.actions.noAction(),
                trueGameAction: AbilityDsl.actions.sequentialContext((context) => {
                    const opponent = context.player.opponent;
                    const setAsideCards: DrawCard[] = opponent?.hand.shuffle().slice(0, this.#cardCount(context));
                    if (setAsideCards.length === 0) {
                        return { gameActions: [AbilityDsl.actions.noAction()] };
                    }

                    return {
                        gameActions: [
                            AbilityDsl.actions.handler({
                                handler: () => {
                                    this.game.addMessage('{0} sets aside {1}', opponent, setAsideCards);
                                    for (const card of setAsideCards) {
                                        opponent.moveCard(card, Locations.RemovedFromGame);
                                    }
                                }
                            }),

                            AbilityDsl.actions.playerLastingEffect({
                                duration: Durations.UntilEndOfRound,
                                targetController: opponent,
                                effect: AbilityDsl.effects.playerDelayedEffect({
                                    when: { onConflictFinished: () => true },
                                    gameAction: AbilityDsl.actions.handler({
                                        handler: (context) => {
                                            context.game.addMessage('{0} picks back their cards', opponent);
                                            for (const card of setAsideCards) {
                                                opponent.moveCard(card, Locations.Hand);
                                            }
                                        }
                                    })
                                })
                            })
                        ]
                    };
                })
            })
        });
    }

    #cardCount(context: AbilityContext): number {
        return (context.target as DrawCard).getCost();
    }
}
