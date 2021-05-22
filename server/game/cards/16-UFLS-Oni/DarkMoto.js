const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class DarkMoto extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Bow a character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.placeFate(context => ({
                    target: context.source,
                    origin: context.player
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    effect: AbilityDsl.effects.doesNotBow()
                }))
            ]),
            effect: 'place a fate on and prevent {0} from bowing as a result of conflict resolution'
        });
    }
}

DarkMoto.id = 'dark-moto';

module.exports = DarkMoto;
