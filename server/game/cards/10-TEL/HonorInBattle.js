const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants.js');

class HonorInBattle extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            condition: (context) => context.player.getClaimedRings().some((ring) => ring.isConflictType('military')),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

HonorInBattle.id = 'honor-in-battle';

module.exports = HonorInBattle;
