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
                gameAction: AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a card to add to your opponent\'s hand',
                    player: context.player.opponent,
                    cards: context.target,
                    targets: true,
                    message: '{0} chooses {1} to be put into {2}\'s hand. {3} is put on bottom of {2}\'s conflict deck',
                    messageArgs: card => [context.player.opponent, card, context.player, context.target.filter(a => a !== card)],
                    subActionProperties: card => ({ target: card }),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.moveCard(context => ({
                            target: context.targets.selectedCard,
                            destination: Locations.Hand
                        })),
                        AbilityDsl.actions.returnToDeck(context => ({
                            target: context.target.filter(a => a.location !== Locations.Hand),
                            location: Locations.ConflictDiscardPile,
                            bottom: true,
                            shuffle: false
                        }))
                    ])
                }))
            },
            effect: 'have {1} pick between two cards to add to their hand',
            effectArgs: context => [context.player.opponent]
        });
    }
}

RenownedSinger.id = 'renowned-singer';

module.exports = RenownedSinger;
