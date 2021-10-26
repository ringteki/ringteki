const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations } = require('../../../Constants');

class EloquentAdvocate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 2 cards of conflict deck',
            effect: 'look at the top two cards of their conflict deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.handler({
                handler: context => {
                    if(context.player.conflictDeck.size() === 0) {
                        return;
                    }
                    this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose a card to put in your hand',
                        context: context,
                        cards: context.player.conflictDeck.first(2),
                        choices: context.player.conflictDeck.size() === 1 ? ['Take Nothing'] : [],
                        handlers: [() => {
                            this.game.addMessage('{0} puts a card on the bottom of their conflict deck', context.player);
                        }],
                        cardHandler: card => {
                            this.game.addMessage('{0} puts a card in their hand', context.player);
                            context.player.moveCard(card, Locations.Hand);
                            if(context.player.conflictDeck.size() > 0) {
                                this.game.queueSimpleStep(() => context.player.moveCard(context.player.conflictDeck.first(), Locations.ConflictDeck, { bottom: true }));
                                this.game.addMessage('{0} puts a card on the bottom of their conflict deck', context.player);
                            }
                        }
                    });
                }
            })
        });
    }
}

EloquentAdvocate.id = 'eloquent-advocate';
module.exports = EloquentAdvocate;

