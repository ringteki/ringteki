import AbilityDsl from '../../../abilitydsl';
import { PlayTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class Infiltrator extends DrawCard {
    static id = 'infiltrator';

    setupCardAbilities() {
        this.action({
            title: "Look at the top card of an opponent's deck and play or discard it",
            condition: (context) => context.source.isParticipating(),
            effect: "look at the top card of an opponent's deck and play or discard it",
            gameAction: AbilityDsl.actions.deckSearch((context) => ({
                amount: context.player.opponent.showBid,
                player: context.player.opponent,
                choosingPlayer: context.player,
                shuffle: false,
                reveal: true,
                gameAction: AbilityDsl.actions.chooseAction((context) => {
                    return {
                        activePromptTitle: `Choose an action for ${context.target?.name}`,
                        options: {
                            'Play this card': {
                                action: AbilityDsl.actions.playCard({
                                    target: context.target,
                                    playType: PlayTypes.PlayFromHand,
                                    source: this
                                })
                            },
                            'Discard this card': {
                                action: AbilityDsl.actions.discardCard({ target: context.target }),
                                message: '{0} chooses to discard {1}'
                            }
                        }
                    };
                })
            }))
        });
    }
}
