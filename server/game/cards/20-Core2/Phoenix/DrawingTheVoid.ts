import AbilityDsl from '../../../abilitydsl';
import { Locations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class DrawingTheVoid extends DrawCard {
    static id = 'drawing-the-void';

    setupCardAbilities() {
        this.action({
            title: 'Gaze into the void',
            condition: (context) => context.player.isTraitInPlay('shugenja'),
            gameAction: AbilityDsl.actions.sequentialContext((context) => {
                const revealedCards = (context.player.opponent.hand.shuffle() as Array<DrawCard>)
                    .slice(0, 2)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return {
                    gameActions: [
                        AbilityDsl.actions.lookAt((context) => ({
                            target: revealedCards,
                            message: '{0} reveals {1} from their hand - the void reveals...',
                            messageArgs: (cards) => [context.player.opponent, cards]
                        })),
                        AbilityDsl.actions.cardMenu((context) => ({
                            activePromptTitle: 'Choose a card to remove from the game',
                            cards: revealedCards,
                            targets: true,
                            player: context.player.hasAffinity('void') ? Players.Self : Players.Opponent,
                            message: '{0} removes {1} from the game - the void consumes!',
                            messageArgs: (card, player) => [player, card],
                            gameAction: AbilityDsl.actions.moveCard({ destination: Locations.RemovedFromGame })
                        }))
                    ]
                };
            })
        });
    }
}