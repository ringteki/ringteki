const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations, Players, PlayTypes } = require('../../../Constants');

class SandRoadMerchant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at your opponent\'s conflict deck',
            effect: 'look at the top three cards of their opponent\'s conflict deck',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source)
            },
            gameAction: AbilityDsl.actions.deckSearch(context => ({
                amount: 3,
                player: context.player.opponent,
                choosingPlayer: context.player,
                gameAction: AbilityDsl.actions.placeCardUnderneath({
                    destination: this
                }),
                shuffle: false,
                reveal: true,
                placeOnBottomInRandomOrder: true
            }))
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

SandRoadMerchant.id = 'sand-road-merchant';
module.exports = SandRoadMerchant;

