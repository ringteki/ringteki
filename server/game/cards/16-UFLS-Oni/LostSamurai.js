const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class LostSamurai extends BaseOni {
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
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && !card.isFaction('shadowlands'),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}

LostSamurai.id = 'lost-samurai';

module.exports = LostSamurai;
