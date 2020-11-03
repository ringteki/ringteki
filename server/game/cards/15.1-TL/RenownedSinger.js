const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class RenownedSinger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Pick two cards in your discard pile',
            condition: context => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2,
            targets: {
                discardCards: {
                    mode: TargetModes.Exactly,
                    activePromptTitle: 'Choose two conflict cards',
                    numCards: 2,
                    location: Locations.ConflictDiscardPile,
                    cardType: [CardTypes.Character, CardTypes.Attachment, CardTypes.Event],
                    controller: Players.Self
                },
                selectedCard: {
                    dependsOn: 'discardCards',
                    activePromptTitle: 'Choose a card to add to your opponent\'s hand',
                    player: Players.Opponent,
                    location: Locations.ConflictDiscardPile,
                    cardType: [CardTypes.Character, CardTypes.Attachment, CardTypes.Event],
                    controller: Players.Self,
                    cardCondition: (card, context) => {
                        let cards = context.targets.discardCards;
                        if(!Array.isArray(cards)) {
                            cards = [cards];
                        }
                        return cards.includes(card);
                    },
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.moveCard(context => ({
                            target: context.targets.selectedCard,
                            destination: Locations.Hand
                        })),
                        AbilityDsl.actions.returnToDeck(context => ({
                            target: context.targets.discardCards.filter(a => a !== context.targets.selectedCard),
                            location: Locations.ConflictDiscardPile,
                            bottom: true,
                            shuffle: false
                        }))
                    ])
                }
            },
            effect: 'put {1} into their hand and return {2} to the bottom of their conflict deck',
            effectArgs: context => [
                context.targets.selectedCard,
                context.targets.discardCards.filter(a => a !== context.targets.selectedCard)
            ]
        });
    }
}

RenownedSinger.id = 'renowned-singer';

module.exports = RenownedSinger;
