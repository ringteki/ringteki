const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class RenownedSinger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Pick two cards in your discard pile',
            condition: context => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2 && context.player.opponent,
            target: {
                mode: TargetModes.Exactly,
                activePromptTitle: 'Choose two conflict cards',
                numCards: 2,
                location: Locations.ConflictDiscardPile,
                cardType: [CardTypes.Character, CardTypes.Attachment, CardTypes.Event],
                controller: Players.Self,
                gameAction: AbilityDsl.actions.handler({
                    handler: context => this.game.promptWithHandlerMenu(context.player.opponent, {
                        activePromptTitle: 'Choose a card to add to your opponent\'s hand',
                        context: context,
                        cards: context.target,
                        cardHandler: handCard => {
                            let bottomCard = context.target.filter(a => a !== handCard);
                            context.game.addMessage('{0} chooses {1} to be put into {2}\'s hand. {3} is put on the bottom of {2}\'s conflict deck',
                                context.player.opponent, handCard, context.player, bottomCard);

                            let gameAction = AbilityDsl.actions.multiple([
                                AbilityDsl.actions.moveCard({
                                    target: handCard,
                                    destination: Locations.Hand
                                }),
                                AbilityDsl.actions.returnToDeck({
                                    target: bottomCard,
                                    location: Locations.ConflictDiscardPile,
                                    bottom: true,
                                    shuffle: false
                                })
                            ]);

                            gameAction.resolve(undefined, context);
                        }
                    })
                })
            },
            effect: 'have {1} return one of {2} to {3}\'s hand',
            effectArgs: context => [context.player.opponent, context.target, context.player]
        });
    }
}

RenownedSinger.id = 'renowned-singer';

module.exports = RenownedSinger;
