import { AbilityTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ScarletSabre extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Make opponent lose 1 fate',
                printedAbility: false,
                when: {
                    afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
                        && context.player.opponent && context.player.firstPlayer
                },
                gameAction: AbilityDsl.actions.loseFate(context => ({ target: context.player.opponent }))
            })
        });
    }
}

ScarletSabre.id = 'scarlet-sabre';

module.exports = ScarletSabre;
