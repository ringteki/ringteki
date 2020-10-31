const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class YasukiOguri2 extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardTypes.Event && context.source.isDefending()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}

YasukiOguri2.id = 'yasuki-oguri-2'; // This is a guess at what the id might be - please check it!!!

module.exports = YasukiOguri2;
