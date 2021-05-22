const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class Penanggalan extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Bow a character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: card => card.isTainted && card.isParticipating(),
                gameAction: AbilityDsl.actions.placeFate(context => ({
                    target: context.source,
                    origin: context.target
                }))
            },
            effect: 'take a fate from {1} and place it on {2}',
            effectArgs: context => [context.target, context.source]
        });
    }
}

Penanggalan.id = 'penanggalan';

module.exports = Penanggalan;
