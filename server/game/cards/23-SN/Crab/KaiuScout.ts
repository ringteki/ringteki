import { AbilityContext } from '../../../AbilityContext.js';
import { Location, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class KaiuScout extends DrawCard {
    static id = 'kaiu-scout';

    cards: DrawCard[] = [];
    chosenCards: DrawCard[] = [];

    setupCardAbilities() {
        this.cards = [];
        this.chosenCards = [];

        this.action<DrawCard>({
            title: 'Look at cards in a province',
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: card => card.controller.getDynastyCardsInProvince(card.location).filter(a => a.isFacedown()).length > 0,
            },
            gameAction: AbilityDsl.actions.handler({
                handler: (context: AbilityContext) => {
                    this.cards = context.target?.controller.getDynastyCardsInProvince(context.target.location) ?? [];
                    this.cards = this.cards.filter(a => a.isFacedown());
                    this.chosenCards = [];
                    this.selectPrompt(context);
                }
            }),
            effect: 'look at facedown dynasty cards in {1}',
            effectArgs: context => [context.target?.isFacedown() ? context.target.location : context.target]
        });
    };

    selectPrompt(context: AbilityContext) {
        if (!this.cards || this.cards.length <= 0) {
            return;
        }

        const cardHandler = (currentCard: DrawCard) => {
            this.chosenCards.push(currentCard);
            this.cards = this.cards.filter((a: DrawCard) => a !== currentCard);

            if (this.cards && this.cards.length > 0) {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card to turn faceup',
                    context: context,
                    cards: this.cards,
                    cardHandler: cardHandler,
                    choices: ['Done'],
                    handlers: [() => this.resolveSelect(context)]
                });
            } else {
                this.resolveSelect(context);
            }
        };

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to turn faceup',
            context: context,
            cards: this.cards,
            cardHandler: cardHandler,
            choices: ['Done'],
            handlers: [() => this.resolveSelect(context)]
        });
    }

    resolveSelect(context: AbilityContext) {
        if (this.chosenCards.length > 0) {
            this.game.addMessage(
                '{0} turns {1} faceup',
                context.player,
                this.chosenCards,
            );
            context.game.applyGameAction(context, { flipDynasty: this.chosenCards });
        } else {
            this.game.addMessage(
                '{0} does not turn any cards faceup',
                context.player,
            );
        }
    }
}
