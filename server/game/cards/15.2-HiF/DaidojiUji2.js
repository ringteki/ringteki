const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar');
const { Locations, Players, PlayTypes, TargetModes, Decks } = require('../../Constants');

class DaidojiUji2 extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);

        this.reaction({
            title: 'Search your conflict deck',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.deckSearch({
                targetMode: TargetModes.UpTo,
                numCards: 4,
                deck: Decks.ConflictDeck,
                reveal: false,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1} cards', event.player, cards.length);
                        cards.forEach(card => {
                            context.source.controller.moveCard(card, this.uuid);
                            card.facedown = false;
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: event => event.card === card && event.originalLocation === this.uuid
                                },
                                match: card,
                                effect: [
                                    AbilityDsl.effects.hideWhenFaceUp()
                                ]
                            }));
                        });
                    } else {
                        this.game.addMessage('{0} selects no cards', event.player);
                    }
                }
            })
        });

        this.persistentEffect({
            condition: context => context.source.isHonored,
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: card => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(() => {
                    return true;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }

    onCardLeavesPlay(event) {
        if(event.card === this) {
            const cards = this.controller.getSourceList(this.uuid).map(a => a);
            cards.forEach(card => {
                this.controller.moveCard(card, Locations.RemovedFromGame);
            });
            if(cards.length > 0) {
                this.game.addMessage('{0} {1} removed from the game due to {2} leaving play', cards, cards.length === 1 ? 'is' : 'are', this);
            }
        }
    }
}

DaidojiUji2.id = 'daidoji-uji-2';

module.exports = DaidojiUji2;
