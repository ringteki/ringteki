const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class OnikageRider extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Bow a character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating() && context.player.opponent;
                }
            },
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent.getDynastyCardsInProvince(Locations.Provinces)
            }))
        });
    }
}

OnikageRider.id = 'onikage-rider';

module.exports = OnikageRider;
