const DrawCard = require('../../drawcard.js');

class EnlightenedWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onConflictDeclared: (event, context) => event.ringFate > 0 && context.player.opponent && event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.placeFate()
        });
    }
}

EnlightenedWarrior.id = 'enlightened-warrior';

module.exports = EnlightenedWarrior;
