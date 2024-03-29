const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, Locations } = require('../../Constants');

class FifthTowerWatch extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Bow a character',
            when: {
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card.controller === context.player && event.card.location === Locations.PlayArea
            },
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.getMilitarySkill() < context.event.card.getMilitarySkill(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

FifthTowerWatch.id = 'fifth-tower-watch';

module.exports = FifthTowerWatch;
