const DrawCard = require('../../drawcard.js');
const { Phases, CardTypes, Locations } = require('../../Constants');

class YasukiTaka extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate',
            when: {
                onCardLeavesPlay: event => this.game.currentPhase === Phases.Conflict && event.cardStateWhenLeftPlay.isFaction('crab') > 0 &&
                                           event.cardStateWhenLeftPlay.type === CardTypes.Character && event.cardStateWhenLeftPlay.location === Locations.PlayArea
            },
            limit: ability.limit.perPhase(Infinity),
            gameAction: ability.actions.gainFate()
        });
    }
}

YasukiTaka.id = 'yasuki-taka';

module.exports = YasukiTaka;
