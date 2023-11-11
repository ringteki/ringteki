import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShowMeYourStance extends DrawCard {
    static id = 'show-me-your-stance';

    setupCardAbilities() {
        this.duelStrike({
            title: 'You tied! Get a bunch of stuff',
            duelCondition: (duel) => !duel.winner,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.draw((context) => ({ target: context.player })),
                AbilityDsl.actions.gainFate((context) => ({ target: context.player })),
                AbilityDsl.actions.gainHonor((context) => ({ target: context.player })),
                AbilityDsl.actions.selectCard((context) => ({
                    activePromptTitle: 'Choose a duel participant',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card) => context.event.duel.isInvolved(card),
                    message: '{0} honors {1}',
                    messageArgs: (cards) => [context.player, cards],
                    gameAction: AbilityDsl.actions.honor()
                }))
            ]),
            effect: 'draw a card, gain a fate, gain an honor, and honor one of their duelists'
        });

        this.action({
            title: 'Send a character home',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    context.game.currentConflict
                        .getCharacters(context.player)
                        .some((myCard) => myCard.hasTrait('duelist') && myCard.glory >= card.glory),
                gameAction: AbilityDsl.actions.sendHome()
            },
            effect: 'send {0} home'
        });
    }
}
