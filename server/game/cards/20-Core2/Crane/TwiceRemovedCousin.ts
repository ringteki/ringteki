import { CardTypes, Players, Decks, Locations, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TwiceRemovedCousin extends DrawCard {
    static id = 'twice-removed-cousin';

    setupCardAbilities() {
        this.interrupt({
            title: 'Put a character into a province',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.deckSearch({
                    cardCondition: (card) =>
                        card.type === CardTypes.Character && card.printedCost >= 4 && card.isFaction('crane'),
                    amount: 4,
                    deck: Decks.DynastyDeck,
                    shuffle: true,
                    selectedCardsHandler: (context, event, cards) => {
                        if (cards.length > 0) {
                            this.game.addMessage(
                                '{0} selects {1} and puts it into {2}',
                                event.player,
                                cards,
                                context.target.facedown ? context.target.location : context.target
                            );
                            cards.forEach((card) => {
                                event.player.moveCard(card, context.target.location);
                                card.facedown = false;
                            });
                        } else {
                            this.game.addMessage('{0} selects no characters', event.player);
                        }
                    }
                })
            },
            effect: 'put a character from their deck into a province'
        });
    }
}
