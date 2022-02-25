const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players, PlayTypes } = require('../../../Constants');

class DaidojiUji2Reprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search your conflict deck',
            condition: context => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 4,
                reveal: false,
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                message: '{0} puts a card underneath {1}',
                messageArgs: context => {
                    return [context.player, context.source];
                },
                gameAction: AbilityDsl.actions.placeCardUnderneath({
                    destination: this
                })
            })
        });

        this.persistentEffect({
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
