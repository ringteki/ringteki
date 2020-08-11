const DrawCard = require('../../drawcard.js');

class SolitaryStrength extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.delayedEffect({
                condition: context => {
                    let participantsForController = this.game.currentConflict.getNumberOfParticipantsFor(context.source.controller);
                    let parentOwnedByController = context.source.parent.controller === context.source.controller;
                    if(parentOwnedByController) {
                        participantsForController = Math.max(0, participantsForController - 1);
                    }

                    return context.source.parent.isParticipating() && participantsForController > 0;
                },
                message: '{0} is discarded from play as {1} is not participating alone in the conflict',
                messageArgs: context => [context.source, context.source.parent],
                gameAction: ability.actions.discardFromPlay()
            })
        });

        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller
            },
            gameAction: ability.actions.gainHonor()
        });
    }
}

SolitaryStrength.id = 'solitary-strength';

module.exports = SolitaryStrength;
