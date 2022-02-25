const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class YasukiKTrader extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain fate or draw a card',
            when: {
                onCardLeavesPlay: (event, context) => context.source.isParticipating() && event.cardStateWhenLeftPlay.controller === context.player &&
                                           event.cardStateWhenLeftPlay.type === CardTypes.Character
            },
            effect: 'gain 1 fate and draw 1 card',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.gainFate(context => ({ target: context.player})),
                AbilityDsl.actions.draw(context => ({ target: context.player}))
            ])
        });
    }
}

YasukiKTrader.id = 'yasuki-trader';

module.exports = YasukiKTrader;
