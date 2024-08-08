import { CardTypes, Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class KaiuNiemeyer extends DrawCard {
    static id = 'kaiu-niemeyer';

    setupCardAbilities() {
        this.action({
            title: 'Search for a holding',
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card) => card.location !== Locations.StrongholdProvince
            },
            effect: 'search the top ten cards of their dynasty deck for a holding - time to build!',
            handler: (context) =>
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a holding to put in that province',
                    context: context,
                    cardCondition: (card: DrawCard) => card.getType() === CardTypes.Holding,
                    cards: context.player.dynastyDeck.slice(0, 10),
                    choices: ['Take nothing'],
                    handlers: [
                        () => {
                            this.game.addMessage('{0} takes nothing', context.player);
                            context.player.shuffleDynastyDeck();
                            return true;
                        }
                    ],
                    cardHandler: (cardFromDeck: DrawCard) => {
                        this.game.addMessage(
                            '{0} puts {1} in {2}',
                            context.player,
                            cardFromDeck,
                            context.target.location
                        );
                        context.player.moveCard(cardFromDeck, context.target.location);
                        cardFromDeck.facedown = false;
                        context.player.shuffleDynastyDeck();
                        return true;
                    }
                })
        });
    }
}