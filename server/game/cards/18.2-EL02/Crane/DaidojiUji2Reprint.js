const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players, PlayTypes, TargetModes, Decks } = require('../../../Constants');

class DaidojiUji2Reprint extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.deckSearch({
                targetMode: TargetModes.UpTo,
                numCards: 4,
                amount: 8,
                deck: Decks.ConflictDeck,
                reveal: false,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1} cards', event.player, cards.length);
                        cards.forEach(card => {
                            context.player.moveCard(card, this.uuid);
                            card.controller = context.source.controller;
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
            condition: context => context.source.isHonored || context.source.isDishonored,
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: card => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(player => {
                    return player === this.controller;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }
}

DaidojiUji2Reprint.id = 'daidoji-two-ji';

module.exports = DaidojiUji2Reprint;
