const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class WayStationTrader extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take a fate from your opponent',
            when: {
                onCardRevealed: (event, context) =>
                    event.card && event.card.type === CardTypes.Province && context.source.isParticipating() &&
                    context.player.opponent && context.player.opponent.fate > 0
            },
            gameAction: AbilityDsl.actions.takeFate()
        });
    }
}

WayStationTrader.id = 'way-station-trader';

module.exports = WayStationTrader;
