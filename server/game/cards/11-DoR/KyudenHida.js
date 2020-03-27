const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Phases, Locations, PlayTypes } = require('../../Constants');

class KyudenHida extends StrongholdCard {
    setupCardAbilities() {
        this.kyudenHidaCards = [];
        this.action({
            title: 'Play a Character',
            condition: context => context.player.dynastyDeck.size() > 0,
            phase: Phases.Dynasty,
            cost: [AbilityDsl.costs.bowSelf()],
            effect: 'look at the top three cards of their dynasty deck',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: context => this.kyudenHidaCards = context.player.dynastyDeck.first(3)
                }),
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a character',
                    cards: this.kyudenHidaCards,
                    cardCondition: card => card.type === CardTypes.Character,
                    choices: ['Take nothing'],
                    handlers: [() => {
                        let cards = this.kyudenHidaCards;
                        cards.forEach(card => {
                            context.player.moveCard(card, Locations.DynastyDiscardPile);
                        });
                        this.game.addMessage('{0} chooses not to play a character', context.player);
                        this.game.addMessage('{0} discards {1}', context.player, cards);
                        return true;
                    }],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.playCard({
                            resetOnCancel: false,
                            playType: PlayTypes.PlayFromProvince,
                            postHandler: hidaContext => {
                                let card = hidaContext.source;
                                let discardedCards = this.kyudenHidaCards;
                                if(card.location !== Locations.PlayArea) {
                                    this.game.addMessage('{0} chooses not to play a character', context.player);
                                } else {
                                    discardedCards = this.kyudenHidaCards.filter(a => a !== card);
                                }
                                this.game.addMessage('{0} discards {1}', context.player, discardedCards);
                            }
                        }),
                        AbilityDsl.actions.moveCard(context => ({
                            target: this.kyudenHidaCards.filter(a => a !== context.target),
                            destination: Locations.DynastyDiscardPile
                        }))
                    ])
                }))
            ])
        });
    }
}

KyudenHida.id = 'kyuden-hida';
module.exports = KyudenHida;

