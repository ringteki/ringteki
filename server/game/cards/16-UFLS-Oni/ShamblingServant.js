const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class ShamblingServant extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Taint a character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.taint()
            }
        });
    }
}

ShamblingServant.id = 'shambling-servant';

module.exports = ShamblingServant;
