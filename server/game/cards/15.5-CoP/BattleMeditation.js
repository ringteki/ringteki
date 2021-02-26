const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BattleMeditation extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'draw 3 cards',
            when: {
                onBreakProvince: (event, context) => event.conflict.conflictProvince.owner !== context.player
                    && event.conflict.getParticipants(p => p.controller === context.player && p.hasTrait('berserker'))
            },
            gameAction: AbilityDsl.actions.draw({
                amount: 3
            }),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}

BattleMeditation.id = 'battle-meditation';

module.exports = BattleMeditation;
