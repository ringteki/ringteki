const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SinisterPeacekeeper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'lose an honor',
            when: {
                onModifyHonor: (event, context) =>
                    event.amount > 0 && context.player.opponent &&
                    event.player === context.player.opponent,
                onTransferHonor: (event, context) => event.player === context.player && event.amount > 0
            },
            gameAction: AbilityDsl.actions.loseHonor({ target: this.owner.opponent})
        });
    }
}

SinisterPeacekeeper.id = 'sinister-peacekeeper';

module.exports = SinisterPeacekeeper;
